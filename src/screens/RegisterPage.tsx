import React from "react";
import { View, Text, TextInput, Button, StyleSheet, ImageBackground,Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterPage = ({ navigation }: any) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleRegister = async () => {
    if (email === "" || password === "") {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
    const existingEmail = await AsyncStorage.getItem(email);
        if (existingEmail!== null) {
            Alert.alert("Email already exists");}
    
      await AsyncStorage.setItem(email, password);

      Alert.alert("Registration successful");

      navigation.navigate("Login");

    } catch (error) {
      console.error("Error registering:", error);
      Alert.alert("An error occurred. Please try again.");
    }
  };


return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail} />
        
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} />

         <Button title="Register" onPress={handleRegister} />
        <Text style={styles.registerText}>Already have an account?</Text>
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
    </View>   


);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  registerText: {
    marginTop: 10,
  },
  Button: {
    width: "80%",
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    },
});

export default RegisterPage;