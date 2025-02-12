import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Linking,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  MainScreen: undefined;
  FeelingScreen: { selectedDate: Date };
  HistoryScreen: { selectedDate: Date };
};

type MainScreenProps = NativeStackScreenProps<RootStackParamList, "MainScreen">;

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenWebsite = () => {
    const url = "https://noetic-labs.com/";
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      setShowPicker(false);
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const handleOkPress = () => {
    navigation.navigate("FeelingScreen", { selectedDate: date });
  };

  const handleViewHistoryPress = () => {
    navigation.navigate("HistoryScreen", { selectedDate: date });
  };

  return (
    <View style={styles.container}>
      {/* Date Picker Block */}
      <View style={styles.card}>
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowPicker(true)} // Show date picker on press
        >
          <MaterialIcons
            name="calendar-today"
            size={24}
            color="#6200ea"
            style={styles.icon}
          />
          <Text style={styles.dropdownText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        {/* Date Picker */}
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.feelingButton} onPress={handleOkPress}>
          <Image
            source={require("../assets/ADD feeling.png")}
            style={styles.feelingButtonImage}
          />
          <Text style={styles.feelingButtonText}>Add Today's Feeling</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={handleViewHistoryPress}
        >
          <Image
            source={require("../assets/History_icon.png")}
            style={styles.historyButtonImage}
          />
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.textContainer}>
        <Text style={styles.clickableText} onPress={handleOpenWebsite}>
          Noetic Labs Pvt. Ltd
        </Text>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 40,
    alignItems: "center",
    overflow: "hidden",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  dropdown: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    width: "85%",
    borderWidth: 1,
    borderColor: "#0288d1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 18,
    color: "#6200ea",
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 70,
  },
  feelingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0288d1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  feelingButtonImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 20,
  },
  feelingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0288d1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  historyButtonImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 75,
  },
  historyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    right: 52,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignSelf:'center',
    padding: 20,
  },
  clickableText: {
    fontSize: 20,
    fontWeight: "bold",
    color:"#0288d1",
    // marginLeft: 15,
  },
});

export default MainScreen;
