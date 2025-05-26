import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    Modal,
    TouchableOpacity,
    ScrollView,
    Alert
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateNewhabbitForm from "../components/CreateNewhabbitForm";

interface Habit {
    id: string;
    title: string;
    type: string;
    completedDates?: string[];
}

const HabitManagementPage = () => {
    const navigation = useNavigation() as any;
    const [modalVisible, setModalVisible] = useState(false);
    const [darkModeOn, setDarkModeOn] = useState(false);
    const [completedHabits, setCompletedHabits] = useState<Habit[]>([]);

    const changeDarkMode = () => {
        setDarkModeOn((prev) => !prev);
    };

    const loadCompletedHabits = async () => {
        try {
            const stored = await AsyncStorage.getItem("habits");
            const parsed: Habit[] = stored ? JSON.parse(stored) : [];

            const completed = parsed.filter(
                (habit) =>
                    habit.completedDates &&
                    Array.isArray(habit.completedDates) &&
                    habit.completedDates.length > 0
            );

            setCompletedHabits(completed);
        } catch (e) {
            console.error("Error loading completed habits:", e);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCompletedHabits();
        }, [])
    );

    return (
        <>
            <View style={styles.Button}>
                <Button title="Change theme" onPress={changeDarkMode} />
            </View>

            <View style={darkModeOn ? styles.darkContainer : styles.container}>
                <Text
                    style={[
                        styles.title,
                        { color: darkModeOn ? "#fff" : "#222" },
                    ]}
                >
                    Habit Management
                </Text>
                <Text
                    style={[
                        styles.description,
                        { color: darkModeOn ? "#ccc" : "#444" },
                    ]}
                >
                    Manage your habits effectively.
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title="View Habit Calendar"
                        onPress={() => navigation.navigate("HabitCalendar")}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Create New Habit"
                        onPress={() => setModalVisible(true)}
                    />
                </View>

                <ScrollView style={styles.completedSection}>
                    <Text
                        style={[
                            styles.completedTitle,
                            { color: darkModeOn ? "#bb86fc" : "#6200ee" },
                        ]}
                    >
                        Completed Habits
                    </Text>
                    {completedHabits.length > 0 ? (
                        console.log("Completed Habits:", completedHabits),
                        completedHabits.map((habit) => (
                            Alert.alert(
                                "Habit Completed"),
                            <Text
                                key={habit.id}
                                style={[
                                    styles.completedHabit,
                                    { color: darkModeOn ? "lightgreen" : "green" },
                                ]}
                            >
                                {habit.title} ({habit.completedDates?.length} times)
                            </Text>
                        ))
                    ) : (
                        <Text
                            style={[
                                styles.noCompleted,
                                { color: darkModeOn ? "#aaa" : "#999" },
                            ]}
                        >
                            No completed habits yet.
                        </Text>
                    )}
                </ScrollView>

                {/* Modal for creating habit */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <CreateNewhabbitForm />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    darkContainer: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#000",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    buttonContainer: {
        width: "100%",
        marginVertical: 5,
    },
    Button: {
        marginBottom: 20,
        width: "100%",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    closeButton: {
        marginTop: 20,
        alignSelf: "center",
        backgroundColor: "#6200ee",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    completedSection: {
        marginTop: 30,
        width: "100%",
    },
    completedTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    completedHabit: {
        fontSize: 14,
        paddingVertical: 4,
    },
    noCompleted: {
        fontSize: 14,
    },
});

export default HabitManagementPage;
