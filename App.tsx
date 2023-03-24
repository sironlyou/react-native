import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ScrollViewComponent } from "react-native";
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, ImageBackground, Alert, Modal, Pressable } from "react-native";

interface ICondition {
  text?: string;
  icon?: string;
}
interface IWeather {
  pressure_mb: number;
  uv: number;
  vis_km: number;
  wind_kph: number;

  condition: ICondition;
  feelslike_c: number;
  humidity: number;
  temp_c: number;
  wind_dir: string;
  precip_mm: number;
}
interface IDay {
  avghumidity: string;
  avgtemp_c: string;
  avgvis_km: string;
  condition: ICondition;
  daily_chance_of_rain: string;
  daily_chance_of_snow: string;
  daily_will_it_rain: string;
  daily_will_it_snow: string;
  maxtemp_c: number;
  maxwind_kph: string;
  mintemp_c: number;
}
interface IHour {
  chance_of_rain: string;
  chance_of_snow: string;
  cloud: string;
  condition: ICondition;
  feelslike_c: string;
  humidity: string;
  is_day: string;
  temp_c: string;
  vis_km: string;
  will_it_rain: string;
  will_it_snow: string;
  wind_dir: string;
  wind_kph: string;
  time: string;
}
interface IAstro {
  is_moon_up: number;
  is_sun_up: number;
  moon_illumination: string;
  moon_phase: string;
  moonrise: string;
  moonset: string;
  sunrise: string;
  sunset: string;
}
interface IForecast {
  astro: IAstro;
  day: IDay;
  hour: IHour[];
  date: string;
}
interface ILocation {
  name: string;
}
export default function App() {
  const getHour = (hour: string): string => {
    let time = hour.substring(11, 13);
    return time;
  };
  const getWeekDay = (date: string) => {
    let somedate = new Date(date);
    let today = new Date();

    if (today.toDateString() === somedate.toDateString()) return "Today";
    return somedate.toDateString().substr(0, 3);
  };
  const [day, setDay] = useState<IDay[]>();
  const [hour, setHour] = useState<IHour[]>();
  const [location, setLocation] = useState<ILocation>();
  const [forecast, setForecast] = useState<IForecast[]>();
  const [current, setCurrent] = useState<IWeather>();
  const [modalOpen, setModalOpen] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [isCitySelected, setIsSelectedCity] = useState(false);
  useEffect(() => {
    (async () => {
      axios
        .get(`http://api.weatherapi.com/v1/forecast.json?key=6d2f5859e89947b79cc94500232103&q=${selectedCity}&days=10&aqi=no&alerts=yes`)
        .then((response) => {
          setLocation(response.data.location);
          setCurrent(response.data.current);
          setForecast(response.data.forecast.forecastday);
          setHour(response.data.forecast.forecastday[0].hour);
          setDay(response.data.forecast.forecastday[0].day);
          setIsSelectedCity(true);
        });
    })();
  }, [selectedCity]);
  const currentArr: IWeather[] = [];
  current !== undefined && currentArr.push(current);

  const scrollRef = useRef<ScrollView>(null);

  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  // console.log(currentArr);
  return (
    <ImageBackground
      source={{
        uri: "https://sun9-62.userapi.com/impg/TxhK56lXmf710R9D6ZWSIuNtKmqD6rV9o6Lj6A/eZNcueIp8uc.jpg?size=175x385&quality=96&sign=ea38d7456f360ccdb3b665e7da6d8de5&type=album",
      }}
      style={{ flex: 1, height: "100%", width: "100%", position: "relative" }}>
      <View style={styles.container}>
        {isCitySelected === false && (
          <View style={styles.centeredView}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={{ marginBottom: 20 }}>Select the city</Text>
                <Pressable
                  onPress={() => {
                    setSelectedCity("Moscow");
                  }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={styles.modalText}>Moscow </Text>
                    {selectedCity === "Moscow" && <Text> &#x2713;</Text>}
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSelectedCity("New York");
                  }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={styles.modalText}>New York</Text>
                    {selectedCity === "New York" && <Text> &#x2713;</Text>}
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSelectedCity("São Paulo");
                  }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={styles.modalText}>São Paulo</Text>
                    {selectedCity === "São Paulo" && <Text> &#x2713;</Text>}
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        {selectedCity !== "" && (
          <View style={styles.weather}>
            <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
              <View style={styles.locaion}>
                <Text style={styles.data}>{location?.name} </Text>
                <Text style={styles.data}>{current?.temp_c}°C </Text>
                <Text style={styles.data}>{current?.condition.text} </Text>
                <Text style={styles.data}>
                  H:{forecast !== undefined && forecast[0].day.maxtemp_c}°C L:{forecast !== undefined && forecast[0]?.day.mintemp_c}°C{" "}
                </Text>
                {/* <Text style={styles.data}>L:{forecast !== undefined && forecast[0]?.day.mintemp_c}°C </Text> */}
              </View>
              <View style={styles.week}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {hour?.map((hour) => (
                    <View key={Math.random()} style={styles.hour}>
                      <Text>{getHour(hour.time)}</Text>
                      <Image source={{ uri: `https:${hour.condition.icon}` }} style={{ width: 50, height: 50, resizeMode: "cover" }} />
                      <Text>{hour.temp_c}°C</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.tenDays}>
                {forecast?.map((day) => (
                  <View style={styles.day}>
                    <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ width: 90 }}>{getWeekDay(day.date)}</Text>
                      <Image source={{ uri: `https:${day.day.condition.icon}` }} style={{ width: 50, height: 50, resizeMode: "cover" }} />
                    </View>
                    <Text>
                      {day.day.mintemp_c}°C {`     `} {day.day.maxtemp_c}°C
                    </Text>
                  </View>
                ))}
              </View>
              {isCitySelected && (
                <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
                  <Text style={styles.textStyle}>Change city</Text>
                </Pressable>
              )}
              {modalVisible === true && (
                <View style={styles.centeredView}>
                  <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Pressable
                          onPress={() => {
                            setSelectedCity("Moscow");
                            setModalVisible(!modalVisible);
                            onPressTouch();
                          }}>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text style={styles.modalText}>Moscow </Text>
                            {selectedCity === "Moscow" && <Text> &#x2713;</Text>}
                          </View>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setSelectedCity("New York");
                            setModalVisible(!modalVisible);
                            onPressTouch();
                          }}>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text style={styles.modalText}>New York</Text>
                            {selectedCity === "New York" && <Text> &#x2713;</Text>}
                          </View>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setSelectedCity("São Paulo");
                            setModalVisible(!modalVisible);
                            onPressTouch();
                          }}>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text style={styles.modalText}>São Paulo</Text>
                            {selectedCity === "São Paulo" && <Text> &#x2713;</Text>}
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}
const { width, height } = Dimensions.get("window");
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,

    // background: "linear-gradient(180deg, #C5DBFC 0%, #D6B4CE 100%)",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 70,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    marginBottom: 80,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "rgba(0, 0, 255, 0.19)",
    position: "absolute",

    bottom: 50,
    left: 145,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  weather: {},

  data: { fontSize: 25 },
  locaion: { alignItems: "center", marginBottom: 10 },
  hour: {
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  week: {
    padding: 8,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 0, 0, 0.09)",
    borderRadius: 10,
    marginLeft: 10,
    width: "95%",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 20,
  },

  day: {
    flex: 1,
    // marginRight: 10,
    paddingHorizontal: 10,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // textAlign: "right",
    flexDirection: "row",
  },
  tenDays: {
    width: "95%",
    marginLeft: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    marginBottom: 100,
  },
});
