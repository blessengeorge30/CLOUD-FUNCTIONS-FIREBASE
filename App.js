import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen'
import CrudScreen from './screens/CrudScreen';
import AddScreen from './screens/AddScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Each screen must be wrapped with Stack.Screen */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Crud" component={CrudScreen} />
        <Stack.Screen name="AddScreen" component={AddScreen} options={{presentation: 'modal'}} />
        <Stack.Screen name="EditItems" component={AddScreen} options={{presentation: 'modal'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
