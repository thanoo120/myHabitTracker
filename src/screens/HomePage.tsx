import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CreateNewhabbitForm from '../components/CreateNewhabbitForm';
// const navigation = require('@react-navigation/native').useNavigation();
const HomePage = () => {
  const [habits, setHabits] = useState([
    { id: '1', title: 'Drink Water', completed: false },
    { id: '2', title: 'Exercise', completed: false },
    { id: '3', title: 'Read a Book', completed: false },
  ]);

  const handleCompleted = (id: string) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const handleAddHabit = () => {
    // navigation.navigate('CreateHabit');
    console.log("Navigate to Create Habit");
  };

  const handleProfile = () => {
    // Navigate to profile screen
    console.log("Navigate to Profile");
  };

  const handleAnalytics = () => {
    console.log("Navigate to Analytics");
  };

  type Habit = { id: string; title: string; completed: boolean };

  const renderHabit = ({ item }: { item: Habit }) => (
    <View style={styles.habitItem}>
      <Text style={[styles.habitText, item.completed && styles.completedText]}>
        {item.title}
      </Text>
      <Button
        title={item.completed ? 'Undo' : 'Mark as Completed'}
        onPress={() => handleCompleted(item.id)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Home Page!</Text>
      <Text style={styles.subHeader}>This is where you can find your habits and progress.</Text>

      <View style={styles.buttonRow}>
        <Button title="Add Habit" onPress={handleAddHabit} />
        <Button title="Profile" onPress={handleProfile} />
        <Button title="Analytics" onPress={handleAnalytics} />
      </View>

      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={renderHabit}
        contentContainerStyle={{ marginTop: 20 }}
      />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  habitItem: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  habitText: {
    fontSize: 18,
    marginBottom: 5,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'green',
  },
});
