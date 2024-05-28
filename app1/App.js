import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import Login from './Telas/Login';
import Cadastro from './Telas/Cadastro';
import Vagas from './Telas/Vagas';
import Usuarios from './Telas/Usuarios';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Vagas" component={Vagas} />
        <Stack.Screen name="Usuarios" component={Usuarios} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;