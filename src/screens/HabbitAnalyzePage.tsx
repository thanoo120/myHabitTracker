import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Button} from 'react-native';
import {
  calculateTodaysCompletion,
  calculateWeeklyProgress,
} from '../services/habitAnalysisService'; // Adjust path as needed

const HabitAnalyzePage = () => {
  const [todayPercent, setTodayPercent] = useState<number>(0);
  const [weekPercent, setWeekPercent] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(false);

  const changeDarkMode = () => {
    setDarkModeOn(prev => !prev);
  };

  useEffect(() => {
    const analyze = async () => {
      setLoading(true);
      const today = await calculateTodaysCompletion();
      const week = await calculateWeeklyProgress();
      setTodayPercent(today);
      setWeekPercent(week);
      setLoading(false);
    };

    analyze();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Analyzing your habits...</Text>
      </View>
    );
  }

  return (<>
    <View style={styles.Button}>
      <Button title="Change theme" onPress={changeDarkMode} />
    </View>
    <View style={darkModeOn ? styles.darkContainer : styles.container}>
    
      <Text style={styles.title}>Habit Analysis</Text>
      <Text style={styles.stat}>
        ✅ % of Habits Completed Today: {todayPercent.toFixed(1)}%
      </Text>
      <Text style={styles.stat}>
        📈 Weekly Progress: {weekPercent.toFixed(1)}%
      </Text>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
    },

  stat: {
    fontSize: 18,
    marginVertical: 10
    },

  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
    color: '#fff',
  },
  Button: {
    paddingBottom: 10, 
  }
});

export default HabitAnalyzePage;
