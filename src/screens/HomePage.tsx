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
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';
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
       <View style={styles.themeToggleContainer}>
              <Pressable onPress={changeDarkMode} style={styles.themeToggleButton}>
                <Text style={{color: darkModeOn ? '#fff' : '#000'}}>
                  {darkModeOn ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </Pressable>
            </View>

      <Text style={darkModeOn ? styles.titleDark : styles.title}>Your Habits</Text>

      {/* Add New Habit Button */}
      <TouchableOpacity
        style={styles.addHabitButton}
        onPress={() => navigation.navigate('CreateNewHabitForm')}
        activeOpacity={0.8}
      >
        <Text style={styles.addHabitButtonText}>+ Add New Habit</Text>
      </TouchableOpacity>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'daily', 'weekly'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.activeFilter,
              darkModeOn && filter === type ? styles.activeFilterDark : null,
            ]}
            onPress={() => setFilter(type as 'all' | 'daily' | 'weekly')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.activeFilterText,
                darkModeOn && filter === type ? styles.activeFilterTextDark : null,
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
            <View style={[styles.habitItem, darkModeOn && styles.habitItemDark]}>
              <View style={styles.habitTextContainer}>
                <Text style={[styles.habitName, darkModeOn && styles.habitNameDark]}>
                  {item.habitName}
                </Text>
                <Text style={[styles.frequency, darkModeOn && styles.frequencyDark]}>
                  {item.frequency}
                </Text>
              </View>

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    isCompleted ? styles.completedButton : null,
                    darkModeOn && !isCompleted ? styles.completeButtonDark : null,
                  ]}
                  onPress={() => handleMarkCompleted(item)}
                  disabled={isCompleted}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.completeButtonText,
                      isCompleted ? styles.completedButtonText : null,
                    ]}
                  >
                    {isCompleted ? '✅ Completed' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteHabit(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchHabits} />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, darkModeOn && styles.emptyTextDark]}>
            No habits found. Add some!
          </Text>
        }
      />

      {showConfetti && <ConfettiCannon count={100} origin={{ x: 200, y: -10 }} fadeOut />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8ff',
    padding: 20,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  themeButton: {
    alignSelf: 'center',
    backgroundColor: '#13105F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#13105F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  themeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#13105F',
    textAlign: 'center',
    marginBottom: 20,
  },
  titleDark: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#90caf9',
    textAlign: 'center',
    marginBottom: 20,
  },
  addHabitButton: {
    backgroundColor: '#5a72f0',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#5a72f0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  addHabitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  activeFilter: {
    backgroundColor: '#13105F',
  },
  activeFilterDark: {
    backgroundColor: '#3949ab',
  },
  filterText: {
    color: '#000',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '700',
  },
  activeFilterTextDark: {
    color: '#e3f2fd',
  },
  habitItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#555',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
  },
  habitItemDark: {
    backgroundColor: '#222',
    shadowColor: '#000',
  },
  habitTextContainer: {
    marginBottom: 12,
  },
  habitName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#13105F',
  },
  habitNameDark: {
    color: '#90caf9',
  },
  frequency: {
    fontSize: 16,
    color: '#555',
  },
  frequencyDark: {
    color: '#bbb',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completeButton: {
    backgroundColor: '#6fcf97',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#3a7d44',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  completeButtonDark: {
    backgroundColor: '#81c784',
  },
  completedButton: {
    backgroundColor: '#a5d6a7',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  completedButtonText: {
    color: '#2e7d32',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#ba000d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    color: '#777',
  },
  emptyTextDark: {
    color: '#bbb',
  },
    themeToggleContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
   themeToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B7DA',
  }
});

export default HomePage;
