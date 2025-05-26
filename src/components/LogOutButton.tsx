import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Text, StyleSheet,Alert } from "react-native";


import { useNavigation } from "@react-navigation/native";

const LogOutButton = () => {
    const navigation = useNavigation() as any;

    const handleLogout = async () => {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        navigation.navigate('Login');
        Alert.alert("Logged out successfully!");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.button} onPress={handleLogout}>
                Log Out
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    button: {
        backgroundColor: "#6200ee",
        color: "#fff",
        padding: 10,
        borderRadius: 5,
        textAlign: "center",
        fontSize: 16,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
        backgroundColor: "#6200ee",
        padding: 10,
        borderRadius: 5,
    },}
);

export default LogOutButton;