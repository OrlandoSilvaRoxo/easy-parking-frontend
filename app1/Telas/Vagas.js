import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, TextInput, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import Slider from '@react-native-community/slider';

const Vagas = ({ navigation }) => {
  const [vagas, setVagas] = useState([]);
  const [horas, setHoras] = useState(0.5); // 30 minutos por padrão
  const [tempoRestantes, setTempoRestantes] = useState({});
  const [placa, setPlaca] = useState('');
  const precoPorMeiaHora = 20;

  const formatarTempo = (segundos) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateRemainingTime = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diffInSeconds = Math.floor((end - now) / 1000);
    return Math.max(0, diffInSeconds);
  };

  const fetchVagas = async () => {
    try {
      const response = await axios.get('http://192.168.0.101:8443/parking/get-all/');
      const sortedVagas = response.data.sort((a, b) => a.id - b.id);
      setVagas(sortedVagas);
      const initialTimers = sortedVagas.reduce((acc, vaga) => {
        acc[vaga.id] = vaga.occupied ? { remainingTime: calculateRemainingTime(vaga.endTime), plate: vaga.plate } : { remainingTime: null, plate: null };
        return acc;
      }, {});
      setTempoRestantes(initialTimers);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  };

  const criarVaga = async () => {
    try {
      await axios.post('http://192.168.0.101:8443/parking/create/');
      fetchVagas();
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
    }
  };

  useEffect(() => {
    fetchVagas();
  }, []);

  useEffect(() => {
    const timers = {};
    Object.entries(tempoRestantes).forEach(([id, data]) => {
      if (data && data.remainingTime > 0) {
        timers[id] = setInterval(() => {
          setTempoRestantes(prev => {
            const nextTime = prev[id].remainingTime - 1;
            if (nextTime === 0) {
              clearInterval(timers[id]);
              freeParking(id);
            }
            return { ...prev, [id]: { ...prev[id], remainingTime: nextTime } };
          });
        }, 1000);
      }
    });
    return () => {
      Object.values(timers).forEach(clearInterval);
    };
  }, [tempoRestantes]);

  const occupyParking = async (id) => {
    if (!placa) {
      Alert.alert("Erro", "Por favor, insira a placa do carro para reservar a vaga.");
      return;
    }
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + horas * 3600 * 1000).toISOString();
    const payload = JSON.stringify({
      id: id.toString(), // Garantindo que o ID seja uma string
      plate: placa,
      startTime,
      endTime,
    });
    try {
      const response = await axios.post(`http://192.168.0.101:8443/parking/occupy/`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        setTempoRestantes(prev => ({ ...prev, [id]: { remainingTime: horas * 3600, plate: placa } }));
        fetchVagas();
        Alert.alert("Reserva Realizada", `Vaga reservada para a placa ${placa}.\nPreço: R$ ${(horas * precoPorMeiaHora).toFixed(2)}`);
      }
    } catch (error) {
      console.error('Erro ao ocupar vaga:', error.response ? error.response.data : error.message);
      Alert.alert("Erro ao Reservar", "Não foi possível reservar a vaga. Tente novamente.");
    }
  };

  const freeParking = async (id) => {
    try {
      await axios.get(`http://192.168.0.101:8443/parking/free/?id=${id}`);
      setTempoRestantes(prev => ({ ...prev, [id]: { remainingTime: null, plate: null } }));
      fetchVagas();
    } catch (error) {
      console.error('Erro ao liberar vaga:', error);
    }
  };

  const reservarVaga = (vaga) => {
    if (!vaga.occupied) {
      occupyParking(vaga.id);
    } else {
      freeParking(vaga.id);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Button title="Criar Vaga" onPress={criarVaga} />
        <Text style={styles.title}>Placa do carro</Text>
        <TextInput style={styles.input} placeholder="Placa do carro" value={placa} onChangeText={setPlaca} />
        <Text style={styles.title}>Tempo de Reserva</Text>
        <TextInput style={styles.input} placeholder="Horas" keyboardType="numeric" value={String(horas)} onChangeText={text => setHoras(parseFloat(text))} />
        <Slider style={styles.slider} minimumValue={0.5} maximumValue={4} step={0.5} value={horas} onValueChange={setHoras} />
        <Text style={styles.title}>Vagas Disponíveis</Text>
        <View style={styles.vagasContainer}>
          {vagas.map((vaga) => (
            <TouchableOpacity
              key={vaga.id}
              style={[styles.vaga, vaga.occupied && styles.vagaReservada]}
              onPress={() => reservarVaga(vaga)}
            >
              <Text>Vaga {vaga.id}</Text>
              {vaga.occupied && tempoRestantes[vaga.id] && (
                <>
                  <Text>Placa: {tempoRestantes[vaga.id].plate}</Text>
                  <Text>Tempo: {formatarTempo(tempoRestantes[vaga.id].remainingTime)}</Text>
                  <Text>Preço R$ {(horas * precoPorMeiaHora).toFixed(2)}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  vagasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  vaga: {
    width: 150,
    height: 100,
    margin: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  vagaReservada: {
    backgroundColor: 'red',
  },
  input: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
    textAlign: 'center',
  },
  slider: {
    width: 300,
    marginTop: 20,
  },
});

export default Vagas;
