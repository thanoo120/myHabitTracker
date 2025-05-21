import React from "react";
import { View, Text, StyleSheet,Button } from "react-native";
import CreateNewhabbitForm from "../components/CreateNewhabbitForm";

const HabitManagementPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Habit Management</Text>
            <Text style={styles.description}>Manage your habits effectively.</Text>
            <Button title="Create New Habit" onPress={() =><CreateNewhabbitForm/> } />
            <Button title="Edit Habit" onPress={() => alert('Edit Habit Pressed')} />
            <Button title="Delete Habit" onPress={() => alert('Delete Habit Pressed')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },

    Button: {
        margin: 10,
        padding: 10,
        backgroundColor: '#6200ee',
        borderRadius: 5,
        hover: {
            backgroundColor: '#3700b3',
        },
    },
});

export default HabitManagementPage;