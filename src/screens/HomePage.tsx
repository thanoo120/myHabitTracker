import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native'; // ✅ Added for navigation
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Habit = {
  habitName: string;
  frequency: string; 
  completedDates?: string[];
};


type RootStackParamList = {
  HomePage: undefined;
  CreateNewHabitForm: undefined;
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const HomePage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const changeDarkMode = () => {
    setDarkModeOn(prev => !prev);
  };

  const fetchHabits = async () => {
    setRefreshing(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      const habitKeys = keys.filter(key => key.startsWith('habit_'));
      const result = await AsyncStorage.multiGet(habitKeys);
      const habitData = result
        .map(([key, value]) => (value ? JSON.parse(value) : null))
        .filter(Boolean);
      setHabits(habitData);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleMarkCompleted = async (habit: Habit) => {
    const today = formatDate(new Date());

    if (habit.completedDates?.includes(today)) {
      Alert.alert('Already marked as completed for today!');
      return;
    }

    const updatedDates = [...(habit.completedDates || []), today];
    const updatedHabit = { ...habit, completedDates: updatedDates };

    try {
      await AsyncStorage.setItem(
        `habit_${habit.habitName}`,
        JSON.stringify(updatedHabit)
      );
      await fetchHabits();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  const handleDeleteHabit = async (habit: Habit) => {
    try {
      await AsyncStorage.removeItem(`habit_${habit.habitName}`);
      await fetchHabits();
      Alert.alert('Habit deleted successfully');
    } catch (error) {
      console.error('Failed to delete habit:', error);
      Alert.alert('Error deleting habit');
    }
  };

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    return habit.frequency?.toLowerCase() === filter;
  });

  return (
    <View style={darkModeOn ? styles.darkContainer : styles.container}>
      <Button title="Change Theme" onPress={changeDarkMode} />
      <Text style={styles.title}>Your Habits</Text>

      {/* Add New Habit Button */}
      <View style={{ marginBottom: 10 }}>
        <Button title="Add New Habit" onPress={() => navigation.navigate('CreateNewHabitForm')} />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'daily', 'weekly'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.activeFilter,
            ]}
            onPress={() => setFilter(type as 'all' | 'daily' | 'weekly')}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.activeFilterText,
              ]}
            >
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Habit List */}
      <FlatList
        data={filteredHabits}
        keyExtractor={item => item.habitName}
        renderItem={({ item }) => {
          const today = formatDate(new Date());
          const isCompleted = item.completedDates?.includes(today);

          return (
            <View style={styles.habitItem}>
              <Text style={styles.habitName}>{item.habitName}</Text>
              <Text style={styles.frequency}>{item.frequency}</Text>
              <Button
                title={isCompleted ? '✅ Completed' : 'Mark Complete'}
                onPress={() => handleMarkCompleted(item)}
                disabled={isCompleted}
              />
              <Button
                title="Delete"
                onPress={() => handleDeleteHabit(item)}
                color={'#D20103'}
              />
            </View>
          );
        }}
        contentContainerStyle={{ marginTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchHabits} />
        }
      />

    
      {showConfetti && (
        <ConfettiCannon count={100} origin={{ x: 200, y: -10 }} fadeOut />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  darkContainer: { flex: 1, padding: 20, backgroundColor: '#000' },
  habitItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#13105F',
    textAlign: 'center',
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  frequency: {
    fontSize: 16,
    color: '#555',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
  },
  activeFilter: {
    backgroundColor: '#13105F',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomePage;
