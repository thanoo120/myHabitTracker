import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCompletedHabitsToday, Habit } from "../services/habitAvailabity"; // Adjust path

// Helper to format date as YYYY-MM-DD string
const formatDate = (date: Date): string => date.toISOString().split("T")[0];

// Generate current week dates from Sunday to Saturday
const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Main component
const HabitCalendarView = () => {
  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load habits and completed habits on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all habit keys starting with "habit_"
        const keys = await AsyncStorage.getAllKeys();
        const habitKeys = keys.filter((key) => key.startsWith("habit_"));
        const storedHabits = await AsyncStorage.multiGet(habitKeys);
        const habits: Habit[] = storedHabits
          .map(([_, value]) => {
            try {
              return value ? JSON.parse(value) : null;
            } catch {
              return null;
            }
          })
          .filter((h): h is Habit => h !== null);

        setAllHabits(habits);

        // Use your provided service to get completed habits for today
        const completed = await getCompletedHabitsToday();
        const completedNames = completed.map((h) => h.habitName);
        setCompletedToday(completedNames);
      } catch (error) {
        console.error("Failed to load habits:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const weekDates = getCurrentWeekDates();

  // Check if a habit is completed on a given date
  const isCompletedOn = (habit: Habit, date: Date) => {
    if (!habit.completedDates) return false;
    return habit.completedDates.includes(formatDate(date));
  };

  // Highlight today date
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Calendar - This Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.weekRow}>
          {weekDates.map((date, index) => (
            <View
              key={index}
              style={[styles.dayCell, isToday(date) && styles.todayCell]}
            >
              <Text style={styles.dayName}>{daysOfWeek[index]}</Text>
              <Text style={styles.dateNumber}>{date.getDate()}</Text>

              {/* Show habits for that day */}
              {allHabits.map((habit, idx) => {
                const completed = isCompletedOn(habit, date);
                return (
                  <View
                    key={`${habit.habitName}-${idx}-${formatDate(date)}`}
                    style={[
                      styles.habitBadge,
                      completed ? styles.completedBadge : styles.incompleteBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.habitText,
                        completed ? styles.completedText : styles.incompleteText,
                      ]}
                      numberOfLines={1}
                    >
                      {habit.habitName}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  weekRow: {
    flexDirection: "row",
  },
  dayCell: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 110,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    alignItems: "center",
    elevation: 3,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: "#6200ee",
    backgroundColor: "#dcd6f7",
  },
  dayName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#666",
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  habitBadge: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 3,
    maxWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  completedBadge: {
    backgroundColor: "#4caf50",
  },
  incompleteBadge: {
    backgroundColor: "#bbb",
  },
  habitText: {
    fontSize: 13,
    fontWeight: "600",
  },
  completedText: {
    color: "white",
  },
  incompleteText: {
    color: "#eee",
  },
});

export default HabitCalendarView;
