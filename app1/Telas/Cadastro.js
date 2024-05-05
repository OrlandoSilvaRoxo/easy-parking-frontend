import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const Cadastro = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [placaCarro1, setPlacaCarro1] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleCadastro = async () => {
    try {
      const payload = {
        name: nome,
        lastName: sobrenome,
        phone: telefone1,
        plate: placaCarro1,
        email: email,
        password: senha
      };
      const response = await axios.post('http://192.168.0.101:8443/user/create/', payload);
      // Assume que o servidor retorna um JSON com a chave 'success'
      if (response.data === true) {
        setModalMessage("Cadastro realizado com sucesso!");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('Login');
        }, 2000);
      } else {
        setModalMessage("Não foi possível realizar o cadastro.");
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setModalMessage("Erro ao cadastrar. Tente novamente mais tarde.");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>Faça seu Cadastro</Text>
      <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="white" onChangeText={setNome} value={nome} />
      <TextInput style={styles.input} placeholder="Sobrenome" placeholderTextColor="white" onChangeText={setSobrenome} value={sobrenome} />
      <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="white" onChangeText={setTelefone1} value={telefone1} />
      <TextInput style={styles.input} placeholder="Placa 1" placeholderTextColor="white" onChangeText={setPlacaCarro1} value={placaCarro1} />
      <TextInput style={styles.input} placeholder="Digite seu email" placeholderTextColor="white" onChangeText={setEmail} value={email} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor="white" onChangeText={setSenha} value={senha} secureTextEntry={true} />
      <Button color="gray" title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'white',
    borderBottomWidth: 0.5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Cadastro;
