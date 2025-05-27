import AsyncStorage from "@react-native-async-storage/async-storage";

interface Habit {
  habitName: string;
  frequency: "Daily" | "Weekly";
  completedDates?: string[]; 
}


const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const getHabits = async (): Promise<Habit[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const storedHabits = await AsyncStorage.multiGet(keys);
  const parsed: Habit[] = storedHabits
    .map(([key, value]) => {
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    })
    .filter((habit): habit is Habit => habit !== null);

  return parsed;
};

export const calculateTodaysCompletion = async (): Promise<number> => {
  const habits = await getHabits();
  const today = formatDate(new Date());
  const total = habits.length;

  const completedToday = habits.filter(habit =>
    habit.completedDates?.includes(today)
  ).length;

  return total === 0 ? 0 : (completedToday / total) * 100;
};

export const calculateWeeklyProgress = async (): Promise<number> => {
  const habits = await getHabits();
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); 

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return formatDate(d);
  });

  const totalExpected = habits.reduce((sum, habit) => {
    if (habit.frequency === "Daily") return sum + 7;
    if (habit.frequency === "Weekly") return sum + 1;
    return sum;
  }, 0);

  const totalCompleted = habits.reduce((sum, habit) => {
    if (!habit.completedDates) return sum;

    const completedThisWeek = habit.completedDates.filter(date =>
      weekDates.includes(date)
    ).length;

    return sum + completedThisWeek;
  }, 0);

  return totalExpected === 0 ? 0 : (totalCompleted / totalExpected) * 100;
};
