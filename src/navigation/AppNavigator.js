import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DetalhesScreen from '../screens/DetalhesScreen';
import CarteiraScreen from '../screens/CarteiraScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Mercado (Home → Detalhes)
function MercadoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D0D0D', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#F7A328',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Detalhes"
        component={DetalhesScreen}
        options={({ route }) => ({ title: route.params?.coin?.name || 'Detalhes' })}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0D0D0D',
            borderTopColor: '#1A1A1A',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#F7A328',
          tabBarInactiveTintColor: '#555',
          tabBarIcon: ({ focused, color }) => {
            const icons = {
              Mercado: focused ? '🪙' : '🔘',
              Carteira: focused ? '💼' : '📁',
            };
            return <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>;
          },
        })}
      >
        <Tab.Screen name="Mercado" component={MercadoStack} />
        <Tab.Screen name="Carteira" component={CarteiraScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
