import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/homeScreen";
import DetailsScreen from "./screens/detailsScreen";
import { API_KEY } from "@env";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="Home Screen"
          component={HomeScreen}
          options={{
            title: "Bus Arrival App",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffc",
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowRadius: 5,
            },
            headerTintColor: "#f55",
            headerTitleStyle: {
              fontSize: 24,
              color: "navy",
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Details Screen"
          component={DetailsScreen}
          options={{
            title: "Bus Arrival Information",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#ffc",
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowRadius: 5,
            },
            headerTintColor: "#f55",
            headerTitleStyle: {
              fontSize: 24,
              color: "navy",
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
