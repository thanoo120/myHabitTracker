import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import HomeScreen from '../screens/HomePage';
import HabitAnalyzeScreen from '../screens/HabbitAnalyzePage';
import HabitManagementScreen from '../screens/HabbitmanagementPage';
import ProfileScreen from '../screens/ProfilePage';

const Tab = createBottomTabNavigator();

const getIcon = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return require('../assets/home.jpg');
    case 'Analyze':
      return require('../assets/report.jpg');
    case 'Manage':
      return require('../assets/manage.jpg');
    case 'Profile':
      return require('../assets/profile.jpg');
   
  }
};

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({size}) => (
          <Image
            source={getIcon(route.name)}
            style={{
              width: size,
              height: size
            }}
          />
        ),
        
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Manage" component={HabitManagementScreen} />
      <Tab.Screen name="Analyze" component={HabitAnalyzeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default Navbar;
