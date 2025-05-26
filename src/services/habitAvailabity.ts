import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Habit {
  habitName: string;
  completedDates?: string[];
}

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

export const getCompletedHabitsToday = async (): Promise<Habit[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const habitKeys = keys.filter(key => key.startsWith("habit_"));
    const storedHabits = await AsyncStorage.multiGet(habitKeys);

    const today = formatDate(new Date());

    const completedHabits: Habit[] = storedHabits
      .map(([_, value]) => {
        try {
          return value ? JSON.parse(value) as Habit : null;
        } catch {
          return null;
        }
      })
      .filter((habit): habit is Habit =>
        habit !== null && !!habit.completedDates && habit.completedDates.includes(today)
      );

    return completedHabits;
  } catch (error) {
    console.error("Error fetching completed habits:", error);
    return [];
  }
};
