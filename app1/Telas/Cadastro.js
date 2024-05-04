// Cadastro.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios'; 

const Cadastro = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone1, setTelefone1] = useState('');
  const [placaCarro1, setPlacaCarro1] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    try {
      const payload = {
        nome, 
        sobrenome, 
        telefone: telefone1, 
        placaCarro: placaCarro1, 
        email, 
        senha
      };
      const response = await axios.post('http://your-backend-url.com/cadastro', payload);
      console.log('Cadastro realizado com sucesso:', response.data);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça seu Cadastro</Text>
      <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="white" onChangeText={value => setNome(value)} />
      <TextInput style={styles.input} placeholder="Sobrenome" placeholderTextColor="white" onChangeText={value => setSobrenome(value)} />
      <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="white" onChangeText={value => setTelefone1(value)} />
      <TextInput style={styles.input} placeholder="Placa 1" placeholderTextColor="white" onChangeText={value => setPlacaCarro1(value)} />
      <TextInput style={styles.input} placeholderTextColor="white" placeholder="Digite seu email" onChangeText={value => setEmail(value)} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor="white" onChangeText={value => setSenha(value)} secureTextEntry={true} />

      <Button style={styles.button} color="gray" title="Cadastrar" onPress={handleCadastro} />
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
  button: {
    backgroundColor: '#FFF',
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
});

export default Cadastro;
