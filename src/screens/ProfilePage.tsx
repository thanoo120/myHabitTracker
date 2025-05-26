import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
  Image,
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
      const storedEmail = await AsyncStorage.getItem('currentUserEmail');
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
      <View style={[styles.center, darkModeOn && styles.darkContainer]}>
        <ActivityIndicator size="large" color={darkModeOn ? '#fff' : '#B55396'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, darkModeOn && styles.darkContainer]}>
      <View style={styles.themeToggleContainer}>
        <Pressable onPress={changeDarkMode} style={styles.themeToggleButton}>
          <Text style={{ color: darkModeOn ? '#fff' : '#000' }}>
            {darkModeOn ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </Pressable>
      </View>

      <View style={[styles.profileCard, darkModeOn && styles.profileCardDark]}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.name, darkModeOn && styles.darkText]}>Name:{name}</Text>
        <Text style={[styles.email, darkModeOn && styles.darkText]}>E-mail:{email}</Text>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            darkModeOn ? styles.logoutButtonDark : styles.logoutButtonLight,
            pressed && styles.logoutButtonPressed,
          ]}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#f2f6fc',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f6fc',
  },
  themeToggleContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  themeToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B7DA',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    marginTop: 40,
  },
  profileCardDark: {
    backgroundColor: '#1f1f1f',
  },
  profileImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#10B7DA',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20067E',
    marginBottom: 10,
  },
  email: {
    fontSize: 20,
    color: '#444',
    marginBottom: 30,
  },
  darkText: {
    color: '#fff',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center',
  },
  logoutButtonLight: {
    backgroundColor: '#6200ee',
  },
  logoutButtonDark: {
    backgroundColor: '#bb86fc',
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ProfilePage;
