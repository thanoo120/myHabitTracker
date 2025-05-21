import React from "react";
import { View, Text, TextInput, Button, StyleSheet,Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateNewhabbitForm = () => {
    const [habitName, setHabitName] = React.useState("");
    const [frequency, setfrequency] = React.useState("");

    const handleCreateHabit = async () => {
        if (habitName === "" || frequency === "") {
            Alert.alert("Please fill in all fields");
            return;
        }

        try {
            const newHabit = { habitName, frequency };
            await AsyncStorage.setItem(habitName, JSON.stringify(newHabit));
            Alert.alert("Habit created successfully");
        } catch (error) {
            console.error("Error creating habit:", error);
            Alert.alert("An error occurred. Please try again.");
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
            <TextInput
                style={styles.input}
                placeholder="Frequency (e.g., daily, weekly)"
                value={frequency}
                onChangeText={setfrequency}
            />
            <Button title="Create Habit" onPress={handleCreateHabit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },


    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    }
});

export default CreateNewhabbitForm;