import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const LogOutButton = () => {

    const handleLogout = async () => {
        
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
        alert("Logged out successfully!");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.button} onPress={handleLogout}>
                Log Out
            </Text>
        </View>
    );
}