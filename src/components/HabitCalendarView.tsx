import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentWeekDates, daysOfWeek } from './HabitUtils';

// Define the Habit interface
interface Habit {
  id: string;
  title: string;
  type: string;
  completedDates?: string[];
}

// Check if a habit was completed on a given date
const isHabitCompletedOn = (habit: Habit, date: Date) => {
  const formatted = date.toISOString().split('T')[0]; 
  return habit.completedDates?.includes(formatted);
};

const HabitCalendarView = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const stored = await AsyncStorage.getItem('habits');
        const parsed: Habit[] = stored ? JSON.parse(stored) : [];
        setHabits(parsed);
      } catch (e) {
        console.error('Error loading habits:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const dailyHabits = habits.filter((h) => h.type === 'daily');
  const weeklyHabits = habits.filter((h) => h.type === 'weekly');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Weekly Habit Tracker</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarRow}>
        {weekDates.map((date, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayText}>{daysOfWeek[index]}</Text>
            <Text style={styles.dateText}>{date.getDate()}</Text>

            {/* Daily Habits */}
            {dailyHabits.map((habit) => (
              <Text
                key={`daily-${habit.id}-${index}`}
                style={[
                  styles.habitText,
                  isHabitCompletedOn(habit, date) ? styles.completed : styles.incomplete,
                ]}
              >
                {habit.title}
              </Text>
            ))}

            {/* Weekly Habits */}
            {weeklyHabits.map((habit) => (
              <Text
                key={`weekly-${habit.id}-${index}`}
                style={[
                  styles.habitText,
                  isHabitCompletedOn(habit, date) ? styles.completed : styles.incomplete,
                ]}
              >
                {habit.title}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  calendarRow: {
    flexDirection: 'row',
  },
  dayColumn: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  habitText: {
    fontSize: 12,
    marginTop: 4,
  },
  completed: {
    color: 'green',
    fontWeight: 'bold',
  },
  incomplete: {
    color: '#ccc',
  },
});

export default HabitCalendarView;
