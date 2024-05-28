import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const payload = {
        email: email,
        password: password
      };

      const response = await axios.post('http://192.168.0.101:8443/user/login/', payload);

      if (response.data.success) {
        // Armazenar o status de administrador na sessão
        await AsyncStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin));

        // Navegar para a tela Vagas
        navigation.navigate('Vagas');
        
        // Limpar os campos de entrada de dados
        setEmail('');
        setPassword('');
      } else {
        alert('Usuário e/ou Senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleCadastro = () => {
    navigation.navigate('Cadastro');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/art.png')}
      />
      <Text style={styles.title}>Faça seu Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="white"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="white"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
       
      <View style={styles.buttonContainer}>
        <Button color="gray" title="Login" onPress={handleLogin} /> 
      </View>
      
      <View style={styles.buttonContainer}>
        <Button color="gray" title="Cadastrar" onPress={handleCadastro} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000', // Cor de fundo preta
  },
  image: {
    width: 200,
    height: 300,
    marginBottom: 10,
    marginTop: 0,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#fff', // Cor da borda branca
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#fff', // Cor do texto branco
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF',
    width: '100%',
    textAlign: 'center',
  },
});

export default Login;
