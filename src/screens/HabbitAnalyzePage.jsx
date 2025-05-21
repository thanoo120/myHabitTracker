import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const HabitAnalyzePage = () => {    
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Habit Analysis</Text>
            <Text style={styles.description}>Analyze your habits over time.</Text>
            <LineChart
                data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [
                        {
                            data: [20, 45, 28, 80, 99, 43],
                        },
                    ],
                }}
                width={400}
                height={220}
                yAxisLabel="$"
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );}

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
    });

export default HabitAnalyzePage;