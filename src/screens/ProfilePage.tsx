import React from "react";
import { View, Text, StyleSheet } from "react-native";


const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Text style={styles.text}>Welcome to your profile!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ProfilePage;