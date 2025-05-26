import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginPage from "./screens/LoginPage";
import HabitCalendarView from "./components/HabitCalendarView";
import RegisterPage from  "./screens/RegisterPage";
import CreateNewHabitForm from "./components/CreateNewhabbitForm";
import Navbar from "./navigation/Navbar"; 
const Stack = createNativeStackNavigator();

export default function YourComponentName() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />

        <Stack.Screen name="Navbar" component={Navbar} options={{ headerShown: false }} />
        <Stack.Screen name="HabitCalendar" component={HabitCalendarView} />
        <Stack.Screen name="CreateNewHabitForm" component={CreateNewHabitForm} />

      

      </Stack.Navigator>
    </NavigationContainer>
  
  );
}
