import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image } from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'Rafael' && password === '123') {
      navigation.navigate('Vagas'); // Navigate to Cadastro screen
      //LIMPANDO OS CAMPOS DE ENTRADAS DE DADOS
      setEmail('');
      setPassword('');

    } else {
      alert('Usuário e/ou Senha inválidos');
    }
    console.log("Logado!");
    console.log(email);
    console.log(password);

    // Adicione aqui a lógica para validar o login
    // e navegar para a próxima tela se for bem-sucedido
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
