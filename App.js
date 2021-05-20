import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [arrival, setArrival] = useState();
  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=03501";

  function loadBusStopData() {
    fetch(BUSSTOP_URL)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        const myBus = responseData.services.filter(
          (item) => item.no === "97"
        )[0];
        console.log("My Bus data");
        console.log(myBus);
        setArrival(myBus.next.time);
        setLoading(false);
      });
  }
  useEffect(() => {
    loadBusStopData();
  }, []);

  function refreshBusStopData() {}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus arrival time:</Text>
      <Text style={styles.timing}>
        {loading ? <ActivityIndicator size="large" color="orange" /> : arrival}
      </Text>
      <TouchableOpacity style={styles.button} onPress={refreshBusStopData}>
        <Text style={styles.buttonText}>Refresh!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 10,
  },
  title: {
    fontSize: 32,
  },
  timing: {
    fontSize: 64,
  },
  buttonText: {
    fontSize: 32,
    color: "white",
  },
});
