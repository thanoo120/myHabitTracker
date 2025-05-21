import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import Navbar from "../navigation/Navbar";
const HomePage = () => {
    return (
   <View style={Styles.container}>
      <Text style={Styles.text}>Welcome to the Home Page!</Text>
      <Text style={Styles.text1}>This is where you can find your habits and progress.</Text>
    </View>
    );
}
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    text1: {
        fontSize: 18,
        color: "#666",
    },
})
export default HomePage;