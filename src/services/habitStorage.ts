import AsyncStorage from '@react-native-async-storage/async-storage';

export type Habit = {
  habitName: string;
  frequency: string;
  completedDates?: string[];
};

export const fetchAllHabits = async (): Promise<Habit[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const habitKeys = keys.filter(key => key.startsWith('habit_'));
  const result = await AsyncStorage.multiGet(habitKeys);
  return result
    .map(([key, value]) => (value ? JSON.parse(value) as Habit : null))
    .filter((habit): habit is Habit => habit !== null);
};
