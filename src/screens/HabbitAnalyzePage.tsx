import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {
  calculateTodaysCompletion,
  calculateWeeklyProgress,
  getHabits,
} from '../services/habitAnalysisService'; // Adjust path as needed

const formatDateDisplay = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const HabitAnalyzePage = () => {
  const [todayPercent, setTodayPercent] = useState<number>(0);
  const [weekPercent, setWeekPercent] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(false);

  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const changeDarkMode = () => {
    setDarkModeOn((prev) => !prev);
  };

  useEffect(() => {
    const analyze = async () => {
      setLoading(true);
      try {
        const todayComp = await calculateTodaysCompletion();
        const weekComp = await calculateWeeklyProgress();
        const habits = await getHabits();
        const todayStr = new Date().toISOString().split('T')[0];

        const completedCount = habits.filter((habit) =>
          habit.completedDates?.includes(todayStr)
        ).length;

        setTodayPercent(todayComp);
        setWeekPercent(weekComp);
        setTasksCompleted(completedCount);
        setTotalTasks(habits.length);
      } catch (err) {
        console.error('Error analyzing habits:', err);
      }
      setLoading(false);
    };

    analyze();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, darkModeOn && styles.darkContainer]}>
        <ActivityIndicator
          size="large"
          color={darkModeOn ? '#fff' : '#13105F'}
        />
        <Text style={[styles.loadingText, darkModeOn && { color: '#fff' }]}>
          Analyzing your habits...
        </Text>
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

      <Text style={[styles.dateText, darkModeOn && { color: '#ccc' }]}>
        {formatDateDisplay(new Date())}
      </Text>

      <Text style={[styles.title, darkModeOn && { color: '#fff' }]}>
        Habit Analysis
      </Text>

      <View style={[styles.statBox, darkModeOn && styles.darkStatBox]}>
        <Text style={[styles.stat, darkModeOn && { color: '#d4f1f9' }]}>
          ✅ Habits Completed Today: {tasksCompleted} / {totalTasks}
        </Text>
        <Text style={[styles.stat, darkModeOn && { color: '#d4f1f9' }]}>
          🎯 % Completed Today: {todayPercent.toFixed(1)}%
        </Text>
      </View>

      <View style={[styles.statBox, darkModeOn && styles.darkStatBox]}>
        <Text style={[styles.stat, darkModeOn && { color: '#fcd1d1' }]}>
          📈 Weekly Progress: {weekPercent.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#13105F',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#13105F',
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  darkStatBox: {
    backgroundColor: '#1e1e1e',
    shadowOpacity: 0.3,
  },
  stat: {
    fontSize: 20,
    marginVertical: 8,
    fontWeight: '600',
    color: '#13105F',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#13105F',
    textAlign: 'center',
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
  },
});

export default HabitAnalyzePage;
