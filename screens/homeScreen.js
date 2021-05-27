import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [busStop, setBusStop] = useState("01112");
  const [bus, setBus] = useState("80");
  const [textColour, setTextColour] = useState("#800000");

  useEffect(() => {
    const interval = setInterval(() => {
      if (textColour == "#800000") {
        setTextColour("#B22222");
      } else {
        setTextColour("#800000");
      }
    }, 100);
    return () => clearInterval(interval);
  });

  function login() {
    navigation.navigate("Details Screen", { busStop, bus });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.container2]}>
        <MaterialCommunityIcons name="bus-stop" size={64} color="#ffc" />
        <TextInput
          style={styles.textInput}
          value={busStop}
          onChangeText={(busStop) => setBusStop(busStop)}
          //placeholder="Stop No."
          keyboardType="number-pad"
        />
      </View>

      <View style={[styles.container2]}>
        <MaterialCommunityIcons name="bus" size={64} color="#ffc" />
        <TextInput
          style={styles.textInput}
          value={bus}
          onChangeText={(bus) => setBus(bus)}
          //placeholder="Bus No."
        />
      </View>
      <View>
        <TouchableOpacity style={{ height: 150 }} onPress={login}>
          <MaterialCommunityIcons
            name="database-search"
            size={128}
            color={textColour}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    alignItems: "center",
    width: "80%",
    flexDirection: "column",
    borderWidth: 1,
    padding: 5,
    margin: 10,
    backgroundColor: "navy",
    borderRadius: 8,
  },
  textInput: {
    backgroundColor: "white",
    width: "100%",
    color: "#800000",
    fontSize: 64,
    fontWeight: "700",
    borderRadius: 5,
    textAlign: "center",
  },
});
