import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomePage';
import HabitAnalyzeScreen from '../screens/HabbitAnalyzePage';
import HabitManagementScreen from '../screens/HabbitmanagementPage';
import ProfileScreen from '../screens/ProfilePage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Analyze') {
            iconName = 'analytics-outline';
          } else if (route.name === 'Manage') {
            iconName = 'list-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analyze" component={HabitAnalyzeScreen} />
      <Tab.Screen name="Manage" component={HabitManagementScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Navbar;


