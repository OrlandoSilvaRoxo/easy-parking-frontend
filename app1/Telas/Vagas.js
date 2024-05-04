import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';

const Vagas = ({navigation}) => {
  const [vagasDisponiveis, setVagasDisponiveis] = useState([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
  const [dia, setDia] = useState('');
  const [horas, setHoras] = useState(0.5); // 30 minutos
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(null);
  const precoPorMeiaHora = 20;

  useEffect(() => {
    let timer;
    if (vagaSelecionada !== null) {
      const duracaoEmSegundos = horas * 3600;
      setTempoRestante(duracaoEmSegundos);

      timer = setInterval(() => {
        setTempoRestante((prevTempo) => {
          if (prevTempo === 0) {
            clearInterval(timer);
            setVagaSelecionada(null);
            const novasVagas = [...vagasDisponiveis];
            novasVagas[vagaSelecionada - 1] = true;
            setVagasDisponiveis(novasVagas);
            return 0;
          }
          return prevTempo - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [vagaSelecionada, horas]);

  const reservarVaga = (numero) => {
    if (vagasDisponiveis[numero - 1]) {
      const precoTotal = horas * precoPorMeiaHora;
      alert(`Vaga ${numero} reservada com sucesso!\nData: ${dia}\nHoras: ${horas}\nPreço R$ ${precoTotal.toFixed(2)}`);
      setVagaSelecionada(numero);
      const novasVagas = [...vagasDisponiveis];
      novasVagas[numero - 1] = false;
      setVagasDisponiveis(novasVagas);
    } else if (vagaSelecionada === numero) {
      alert(`Reserva da Vaga ${numero} cancelada.`);
      setVagaSelecionada(null);
      const novasVagas = [...vagasDisponiveis];
      novasVagas[numero - 1] = true;
      setVagasDisponiveis(novasVagas);
    } else {
      alert(`Desculpe, a vaga ${numero} já está reservada.`);
    }
  };

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  const formatarData = (data) => {
    if (data.length === 8) {
      const dia = data.substring(0, 2);
      const mes = data.substring(2, 4);
      const ano = data.substring(4, );
      return `${dia}/${mes}/${ano}`;
    }
    return data;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vagas Disponiveis</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          textAlign= 'center'
          placeholderTextColor="white"
          keyboardType="numeric"
          maxLength={8}
          value={formatarData(dia)}
          onChangeText={setDia}
        />
        <Text style={styles.title}>Horas: {horas}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.5} // 30 minutos
          maximumValue={4} // Até 2 horas
          step={0.5} // Incremento de 30 minutos
          value={horas}
          onValueChange={setHoras}
        />
      </View>
      <View style={styles.vagasContainer}>
        {vagasDisponiveis.map((disponivel, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.vaga, !disponivel && styles.vagaReservada, vagaSelecionada === index + 1 && styles.vagaSelecionada]}
            onPress={() => reservarVaga(index + 1)}
            disabled={!disponivel && vagaSelecionada !== index + 1}
          >
            <Text>Vaga {index + 1}</Text>
            {vagaSelecionada === index + 1 && <Text>Tempo: {formatarTempo(tempoRestante)}</Text>}
            {vagaSelecionada === index + 1 && <Text>Preço R$ {(horas * precoPorMeiaHora).toFixed(2)}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 0,
    height: 40,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    color:'white',
    textalign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'white',
  },
  inputContainer: {
    marginBottom: 20,
    alignItems: 'center',
    color:'white',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  slider: {
    width: 200,
    height: 40,
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: 'white',
  },
  vagasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  vaga: {
    width: 100,
    height: 50,
    margin: 9,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Adiciona bordas arredondadas para parecerem mais como cadeiras
    borderWidth: 2, // Adiciona uma borda para destacar as cadeiras
    borderColor: 'white', // Cor da borda
    transform: [{ rotate: '-45deg' }], // Rotação para parecer como se estivessem inclinadas
  },  
  vagaReservada: {
    backgroundColor: 'red',
  },
  vagaSelecionada: {
    backgroundColor: 'yellow',
  },
});

export default Vagas;
