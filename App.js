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
  const [available, setAvailable] = useState(false);
  const [arrival2, setArrival2] = useState();
  const [duration, setDuration] = useState();
  const [bus, setBus] = useState("97");
  const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=03501";

  function loadBusStopData() {
    /* fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast")
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
      });
      */

    setLoading(true);
    fetch(BUSSTOP_URL)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        if (responseData.services.length != 0) {
          const myBus = responseData.services.filter(
            (item) => item.no === bus
          )[0];
          console.log("My Bus data");
          console.log(responseData.services);

          if (myBus.next.time != []) {
            let localTime = new Date(myBus.next.time).toLocaleTimeString(
              "en-US"
            );
            setArrival(localTime);

            if (myBus.next.duration_ms > 0) {
              let durationInS = Math.round(myBus.next.duration_ms / 1000);
              let durationInM = Math.round((durationInS - 30) / 60);
              durationInS = durationInS - durationInM * 60;
              setDuration(`(in ${durationInM}m ${durationInS}s)`);
            } else {
              setDuration("Bus Arrived");
            }
          } else {
            setArrival("No Est. Available");
            setDuration("No Est. Available");
          }

          if (myBus.next2.time != []) {
            let localTime2 = new Date(myBus.next2.time).toLocaleTimeString(
              "en-US"
            );
            setArrival2(`Next arrival: ${localTime2}`);
          } else {
            setArrival2("No Est. Available");
          }

          setLoading(false);
          setAvailable(true);
        } else {
          console.log("My Bus data");
          console.log(`Bus ${bus} Not In Operation`);
          setArrival(`Not In Operation`);
          setArrival2("Not In Operation");
          setDuration("No Est. Available");
          setLoading(false);
          setAvailable(false);
        }
      });
  }
  useEffect(() => {
    const interval = setInterval(loadBusStopData, 10000);
    return () => clearInterval(interval);
  }, []);

  function refreshBusStopData() {}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Bus ${bus} arrival time:`}</Text>
      <Text style={styles.timing}>
        {loading ? <ActivityIndicator size="large" color="orange" /> : arrival}
      </Text>
      <Text style={styles.timing3}>
        {loading ? <ActivityIndicator size="large" color="orange" /> : duration}
      </Text>
      <Text style={styles.timing2}>
        {loading ? <ActivityIndicator size="small" color="blue" /> : arrival2}
      </Text>
      <TouchableOpacity style={styles.button} onPress={loadBusStopData}>
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
    textAlign: "center",
  },
  timing: {
    fontSize: 48,
    textAlign: "center",
  },
  timing3: {
    fontSize: 32,
    textAlign: "center",
  },
  timing2: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 32,
    color: "white",
    textAlign: "center",
  },
});
