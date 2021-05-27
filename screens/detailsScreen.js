import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDistance, getPreciseDistance } from "geolib";
//import { API_KEY } from "@env";

export default function DetailsScreen({ route, navigation }) {
  const bus = route.params.bus;
  const busStop = route.params.busStop;
  const [loading, setLoading] = useState(true);
  const [arrival, setArrival] = useState();
  const [arrival2, setArrival2] = useState();
  const [duration, setDuration] = useState();
  const [busFeature, setBusFeature] = useState("");
  const [busLoad, setBusLoad] = useState("");
  const [busType, setBusType] = useState("");
  const [busType2, setBusType2] = useState("");
  const [operator, setOperator] = useState("");
  const [busStopName, setBusStopName] = useState("");
  const [roadName, setRoadName] = useState("");
  const [busStopStat, setBusStopStat] = useState("");
  const [forecastText, setForecastText] = useState("");
  const [distanceWS, setDistanceWS] = useState("");
  const [isWeatherLoaded, setWeatherLoaded] = useState(false);
  const BUS_URL = `https://arrivelah2.busrouter.sg/?id=${busStop}`;
  const WEATHER_STAION_URL =
    "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";
  var index = 0;
  var qText = "";

  useEffect(() => {
    const interval = setInterval(loadLTAData, 1000);
    return () => clearInterval(interval);
  }, []);

  function loadLTAData() {
    if (!isWeatherLoaded) {
      fetch(
        `http://datamall2.mytransport.sg/ltaodataservice/BusStops${qText}`,
        {
          headers: {
            AccountKey: ,
            Connection: "keep-alive",
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          const myBusStop = responseData.value.filter(
            (item) => item.BusStopCode == busStop
          )[0];
          console.log(isWeatherLoaded);
          if (typeof myBusStop != "undefined") {
            const busStopCoordinate = {
              latitude: myBusStop.Latitude,
              longitude: myBusStop.Longitude,
            };
            setBusStopName(myBusStop.Description);
            setRoadName(myBusStop.RoadName);
            fetch(WEATHER_STAION_URL)
              .then((response2) => {
                return response2.json();
              })
              .then((responseData2) => {
                setForecastText("");
                const sList = responseData2.area_metadata;
                const fList = responseData2.items[0].forecasts;
                let testPoint = {
                  latitude: parseFloat(sList[0].label_location.latitude),
                  longitude: parseFloat(sList[0].label_location.longitude),
                };
                let minDistance = getDistance(busStopCoordinate, testPoint);
                let stationIndex = 0;
                for (var i = 1; i < sList.length; i++) {
                  testPoint = {
                    latitude: parseFloat(sList[i].label_location.latitude),
                    longitude: parseFloat(sList[i].label_location.longitude),
                  };
                  let distance = getDistance(busStopCoordinate, testPoint);
                  if (distance <= minDistance) {
                    stationIndex = i;
                    minDistance = distance;
                  }
                }
                setForecastText(`${fList[stationIndex].forecast}`);
                setDistanceWS(
                  `${minDistance}m to [${sList[stationIndex].name} Station]`
                );
                setWeatherLoaded(true);
              });
          } else if (index <= 5000) {
            index += 500;
            qText = `?$skip=${index}`;
            console.log(index, qText, responseData.value[0].BusStopCode);
          } else {
            setBusStopName("Undefined bus stop name");
            setRoadName("Undefined road name");
            setForecastText("Undefined weather forecast");
            setDistanceWS("Undefined nearest weather station");
            setWeatherLoaded(true);
          }
        });
    }
  }

  useEffect(() => {
    const interval = setInterval(loadBusStopData, 5000);
    return () => clearInterval(interval);
  }, []);
  function toLoadBusStopData() {
    setLoading(true);
    loadBusStopData();
  }

  function loadBusStopData() {
    fetch(BUS_URL)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setOperator("");
        setBusFeature("");
        setBusLoad("");
        setBusType("");
        setBusType2("");
        if (responseData.services.length == 0) {
          setBusStopStat("Not In Operation");
          setArrival(`Not In Operation`);
          setArrival2("Not In Operation");
          setDuration("No Est. Available");
        } else {
          let busList = responseData.services[0].no;
          for (var i = 1; i < responseData.services.length; i++) {
            busList = `${busList}, ${responseData.services[i].no}`;
          }
          setBusStopStat(`In service: ${busList}`);
          const myBus = responseData.services.filter(
            (item) => item.no === bus
          )[0];
          if (typeof myBus == "undefined") {
            setArrival(`Not In Operation`);
            setArrival2("Not In Operation");
            setDuration("No Est. Available");
          } else {
            if (myBus.next.time != []) {
              let localTime = new Date(myBus.next.time).toLocaleTimeString(
                "en-US",
                { hour12: true }
              );
              setArrival(`[ ${localTime} ]`);
              if (myBus.next.duration_ms > 0) {
                let durationInS = Math.round(myBus.next.duration_ms / 1000);
                let durationInM = Math.round((durationInS - 30) / 60);
                durationInS = durationInS - durationInM * 60;
                setDuration(`Arrives in ${durationInM}m ${durationInS}s`);
              } else {
                setDuration("Bus Arrived");
              }
            } else {
              setArrival("No Est. Available");
              setDuration("No Est. Available");
            }
            if (myBus.subsequent.time != []) {
              let localTime2 = new Date(myBus.next2.time).toLocaleTimeString(
                "en-US"
              );
              setArrival2(`Subsequent ${localTime2}`);
            } else {
              setArrival2("No Est. Available");
            }
            setOperator(myBus.operator);
            if (myBus.next.feature == "WAB") {
              setBusFeature("wheelchair-accessibility");
            } else {
              setBusFeature("");
            }
            if (myBus.next.load == "SEA") {
              setBusLoad("Seats Available");
            } else if (myBus.next.load == "SDA") {
              setBusLoad("Standing Available");
            } else {
              setBusLoad("Limited Standing");
            }
            if (myBus.next.type == "SD") {
              setBusType("bus-side");
            } else if (myBus.next.type == "DD") {
              setBusType("bus-double-decker");
            } else if (myBus.next.type == "BD") {
              setBusType2("bus-articulated-front");
              setBusType("bus-articulated-end");
            } else {
              setBusType("bus");
            }
          }
        }
        setLoading(false);
      });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.container2]}>
        <View style={[styles.container2p]}>
          <MaterialCommunityIcons name="bus-stop" size={64} color="#ffc" />
          <Text style={styles.textLabel}>{busStop}</Text>
        </View>
        <View style={[styles.container3]}>
          <Text style={styles.textInput}>
            {loading ? (
              <ActivityIndicator size="large" color="#800000" />
            ) : (
              busStopStat
            )}
          </Text>

          <Text style={styles.textInput2}>
            {!isWeatherLoaded ? (
              <ActivityIndicator size="large" color="navy" />
            ) : (
              busStopName
            )}
          </Text>
          <Text style={styles.textInput2}>
            {!isWeatherLoaded ? (
              <ActivityIndicator size="large" color="navy" />
            ) : (
              roadName
            )}
          </Text>
        </View>
        <Text style={styles.textInput3}>
          {!isWeatherLoaded ? (
            <ActivityIndicator size="small" color="#ffc" />
          ) : (
            forecastText
          )}
        </Text>
      </View>

      <View style={[styles.container2]}>
        <View style={[styles.container2p]}>
          <MaterialCommunityIcons name="bus" size={64} color="#ffc" />
          <Text style={styles.textLabel}>{`${bus} ${operator}`}</Text>
        </View>
        <View style={[styles.container3]}>
          <View style={[styles.container3p]}>
            <MaterialCommunityIcons
              name={loading ? "" : busType}
              size={64}
              color="#800000"
            />
            <MaterialCommunityIcons
              name={loading ? "" : busType2}
              size={64}
              color="#800000"
            />
            <MaterialCommunityIcons
              name={loading ? "" : busFeature}
              size={64}
              color="#800000"
            />
          </View>
          <Text style={styles.textInput}>
            {loading ? (
              <ActivityIndicator size="large" color="#800000" />
            ) : (
              duration
            )}
          </Text>
          <Text style={styles.textInput}>
            {loading ? (
              <ActivityIndicator size="large" color="#800000" />
            ) : (
              arrival
            )}
          </Text>
          <Text style={styles.textInput2}>
            {loading ? (
              <ActivityIndicator size="large" color="navy" />
            ) : (
              busLoad
            )}
          </Text>
        </View>
        <Text style={styles.textInput3}>
          {loading ? <ActivityIndicator size="small" color="navy" /> : arrival2}
        </Text>
      </View>

      <View>
        <TouchableOpacity style={{ height: 150 }} onPress={toLoadBusStopData}>
          <MaterialCommunityIcons
            name="refresh-circle"
            size={64}
            color="#800000"
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
    justifyContent: "flex-start",
  },
  container2: {
    alignItems: "center",
    width: "95%",
    borderWidth: 1,
    padding: 1,
    margin: 4,
    backgroundColor: "navy",
    borderRadius: 8,
    flexDirection: "column",
  },
  container2p: {
    alignItems: "center",
    width: "80%",
    backgroundColor: "navy",
    borderRadius: 8,
    flexDirection: "row",
  },
  textInput: {
    backgroundColor: "white",
    width: "100%",
    color: "#800000",
    fontSize: 36,
    fontWeight: "700",
    borderRadius: 5,
    textAlign: "center",
  },
  textInput2: {
    backgroundColor: "white",
    width: "100%",
    color: "navy",
    fontSize: 30,
    borderRadius: 5,
    textAlign: "center",
  },
  textInput3: {
    backgroundColor: "navy",
    width: "100%",
    color: "#ffc",
    fontSize: 24,
    borderRadius: 5,
    textAlign: "center",
  },
  textLabel: {
    color: "#ffc",
    fontSize: 48,
    fontWeight: "700",
    borderRadius: 5,
    textAlign: "center",
    marginLeft: 10,
  },
  container3: {
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 5,
  },
  container3p: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
});
