import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HistoryData {
  selectedDate: string;
  selectedValues: Record<string, string[]>;
  reason: string;
  action: string;
}

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryData[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showDatePickers, setShowDatePickers] = useState<boolean[]>([false, false]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const storedData = await AsyncStorage.getItem("savedData");
        if (storedData) {
          const parsedData: HistoryData[] = JSON.parse(storedData);
          setHistoryData(parsedData);
          filterDataByDateRange(parsedData, startDate, endDate);
        } else {
          setHistoryData([]);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load history data.");
        console.error(error);
      }
    };

    fetchHistory();
  }, [startDate, endDate]);

  
  const filterDataByDateRange = (data: HistoryData[], startDate: Date, endDate: Date) => {
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);
  
    const filtered = data
      .filter((item) => {
        const itemDate = new Date(item.selectedDate).getTime();
        return itemDate >= start && itemDate <= end;
      })
      .sort((a, b) => new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime()); // Sort by date
  
    setFilteredData(filtered);
  };

  

  const onDateChange = (
    event: any,
    date: Date | undefined,
    index: number
  ) => {
    const updatedDates = [...showDatePickers];
    console.log(updatedDates)
    updatedDates[index] = false;
    setShowDatePickers(updatedDates);

    if (date) {
      if (index === 0) {
        setStartDate(date);
      } else if (index === 1) {
        setEndDate(date);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <LinearGradient colors={["#f3e5f5", "#ffffff"]} style={styles.container}>
      {/* Date Range Pickers */}
      <View style={styles.dateRangePickerContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePickers([true, false])}
          >
            <Text style={styles.datePickerText}>
              Start Date: {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePickers([false, true])}
          >
            <Text style={styles.datePickerText}>
              End Date: {formatDate(endDate)}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePickers[0] && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => onDateChange(event, date, 0)}
          />
        )}
        {showDatePickers[1] && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => onDateChange(event, date, 1)}
          />
        )}
      </View>

      {/* Filtered History */}
      <ScrollView contentContainerStyle={styles.historyContainer}>
        <Text style={styles.historyTitle}>
          History from {formatDate(startDate)} to {formatDate(endDate)}
        </Text>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <View style={styles.headerCard}>
                <FontAwesome5 name="calendar-alt" size={24} color="#673ab7" />
                <Text style={styles.headerText}>{formatDate(item.selectedDate)}</Text>
              </View>
              <View style={styles.emotionsContainer}>
                {item.selectedValues &&
                  Object.keys(item.selectedValues).map(
                    (key) =>
                      item.selectedValues[key].length > 0 && (
                        <View key={key} style={styles.emotionCard}>
                          <View style={styles.tagContainer}>
                            {item.selectedValues[key].map((value) => (
                              <Text key={`${key}-${value}`} style={styles.tag}>
                                {value}
                              </Text>
                            ))}
                          </View>
                        </View>
                      )
                  )}
              </View>
              <View style={styles.detailsCard}>
                <Text style={styles.detailsHeader}>Details</Text>
                <View style={styles.detailRow}>
                  <FontAwesome5
                    name="exclamation-circle"
                    size={20}
                    color="#ff7043"
                  />
                  <Text style={styles.detailText}>
                    Reason: {item.reason || "No reason provided"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <FontAwesome5
                    name="check-circle"
                    size={20}
                    color="#66bb6a"
                  />
                  <Text style={styles.detailText}>
                    Action: {item.action || "No action provided"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No data found for this date range</Text>
        )}
      </ScrollView>

      {/* Logo at Bottom */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/Noeticl_logo.png")}
          style={styles.logo}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 70,
    resizeMode: "contain",
  },
  dateRangePickerContainer: {
    alignItems: "center",
    marginVertical: 20,
    borderColor: "#6200ee",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#f3e5f5",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  datePickerButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#673ab7",
  },
  datePickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  historyContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 15,
    textAlign: "center",
  },
  historyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#673ab7",
    marginLeft: 10,
  },
  detailsCard: {
    marginTop: 10,
    backgroundColor: "#fce4ec",
    borderRadius: 10,
    padding: 15,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#d81b60",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  emotionsContainer: {
    marginTop: 15,
  },
  emotionCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#c8e6c9",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
});

export default HistoryScreen;
