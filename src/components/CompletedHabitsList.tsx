import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getCompletedHabitsToday, Habit } from "../services/habitAvailabity";

const CompletedHabitsList = () => {
  const [completedHabits, setCompletedHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const fetchCompletedHabits = async () => {
      const habits = await getCompletedHabitsToday();
      setCompletedHabits(habits);
    };

    fetchCompletedHabits();
  }, []);

  if (completedHabits.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No habits completed today.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Habits Today:</Text>
      <FlatList
        data={completedHabits}
        keyExtractor={(item) => item.habitName}
        renderItem={({ item }) => (
          <Text style={styles.habitItem}>• {item.habitName}</Text>
        )}
      />
    </View>
  );
};

export default CompletedHabitsList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  habitItem: {
    fontSize: 16,
    marginVertical: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});
