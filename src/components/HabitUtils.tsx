import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getCurrentWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(today.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });
};

interface Habit {
  title: string;
  progress: boolean[];
}

export const HabitRow = ({ habit }: { habit: Habit }) => (
  <View style={styles.habitRow}>
    <Text style={styles.habitTitle}>{habit.title}</Text>
    <View style={styles.checkRow}>
      {habit.progress.map((checked, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.checkBox, checked && styles.checked]}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  habitRow: {
    marginTop: 12,
  },
  habitTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  checked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
});
