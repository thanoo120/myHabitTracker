import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = ({ navigation }: any) => {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
    const [darkModeOn, setDarkModeOn] = useState(false);
     const changeDarkMode = () => {
    setDarkModeOn(prev => !prev);
  };


const loadUserData = async () => {
  try {
    const storedEmail = await AsyncStorage.getItem('currentUserEmail'); // Corrected
    if (storedEmail) {
      const userData = await AsyncStorage.getItem(storedEmail);
      if (userData) {
        const parsedData = JSON.parse(userData);
        setEmail(storedEmail);
        setName(parsedData.name);
      }
    } else {
      Alert.alert('No user is logged in');
      navigation.navigate('Login');
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    Alert.alert('An error occurred while loading profile');
  } finally {
    setLoading(false);
  }
};


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInEmail');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('An error occurred while logging out');
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (<>
<View style={styles.Button}>
      <Button title="Change theme" onPress={changeDarkMode} />
    </View>
      <View style={darkModeOn ? styles.darkContainer : styles.container}>
     
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name: {name}</Text>
      <Text style={styles.label}>Email: {email}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#B55396',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#20067E',
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
    color: '#20067E',
  },
  buttonContainer: {
    marginTop: 30,
  },
  darkContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  Button:{
 
  }
  
});

export default ProfilePage;
