import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert } from 'react-native';
import logScreenBackground from '../assets/logScreen.jpg';

const LoginPage = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      const savedUser = await AsyncStorage.getItem(email); 
      if (savedUser !== null) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.password === password) {
          await AsyncStorage.setItem('currentUserEmail', email);
          Alert.alert('Login successful');
          navigation.navigate('Navbar'); 
        } else {
          Alert.alert('Invalid email or password');
        }
      } else {
        Alert.alert('User not found');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <ImageBackground source={logScreenBackground} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
        <Text style={styles.registerText}>Don't have an account?</Text>
        <Button title="Register" onPress={handleRegister} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  registerText: {
    color: '#007BFF',
    marginTop: 10,
  },
});

export default LoginPage;
