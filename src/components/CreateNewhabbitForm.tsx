import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateNewHabitForm = () => {
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
  ]);

  const handleCreateHabit = async () => {
    if (!habitName || !frequency) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      const newHabit = { habitName, frequency };
      await AsyncStorage.setItem(`habit_${habitName}`, JSON.stringify(newHabit));
      Alert.alert("Habit created successfully");
    } catch (error) {
      console.error("Error saving habit:", error);
      Alert.alert("Error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Habit</Text>
      <TextInput
        style={styles.input}
        placeholder="Habit Name"
        value={habitName}
        onChangeText={setHabitName}
      />
      <DropDownPicker
        open={open}
        value={frequency}
        items={items}
        setOpen={setOpen}
        setValue={setFrequency}
        setItems={setItems}
        style={styles.dropdown}
        placeholder="Select frequency"
      />
      <View style={{ marginTop: 20 }}>
        <Button title="Create Habit" onPress={handleCreateHabit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dropdown: {
    marginBottom: 10,
    borderColor: "#ccc",
  },
});

export default CreateNewHabitForm;
