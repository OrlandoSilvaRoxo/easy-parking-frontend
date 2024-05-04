import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your database functions
import { initDatabase } from './BancoParking/Database';

// Import your screens
import Login from './Telas/Login';
import Cadastro from './Telas/Cadastro';
import Vagas from './Telas/Vagas';


const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const initDatabaseAsync = async () => {
      try {
        const db = await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initDatabaseAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Vagas" component={Vagas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;