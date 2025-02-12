import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const FinalScreen = ({ route, navigation }) => {
  const { selectedValues, selectedDate } = route.params || {};
  const buttonNames = ["Joy", "Fear", "Love", "Anger", "Sadness", "Surprise"];

  const Finaloption = {
    0: ["Amused", "Delighted", "Jovial", "Blissful", "Triumphant", "Hopeful", "Excited", "Euphoric"],
    1: ["Dread", "Mortified", "Anxious", "Worried", "Helpless", "Frightened"],
    2: ["Satisfied", "Compassionate", "Caring", "Romantic", "Fondness"],
    3: ["Contempt", "Revolted", "Resentful", "Frustrated", "Agitated"],
    4: ["Agony", "Hurt", "Depressed", "Sorrow", "Lonely", "Grief"],
    5: ["Shocked", "Astonished", "Speechless", "Touched", "Astounded"],
  };

  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [mainEmotion, setMainEmotion] = useState(null);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState("");

  const handleButtonPress = (buttonIndex) => {
    setDropdownVisible(dropdownVisible === buttonIndex ? null : buttonIndex);
    setMainEmotion(buttonNames[buttonIndex]);
  };

  const handleOptionSelect = (buttonIndex, option) => {
    const updatedSelectedValues = { ...selectedValues };
    updatedSelectedValues[buttonIndex] = [...(updatedSelectedValues[buttonIndex] || []), option];
    navigation.setParams({ selectedValues: updatedSelectedValues });
    setDropdownVisible(null);
  };

  const handleSave = async () => {
    if (!reason || !action) {
      Alert.alert("Missing Fields", "Please fill in both Reason and Action.");
      return;
    }
  
    const dataToSave = {
      selectedDate,
      selectedValues,
      reason,
      action,
    };
  
    try {
      // Retrieve existing data from AsyncStorage
      const existingData = await AsyncStorage.getItem("savedData");
      const parsedData = existingData ? JSON.parse(existingData) : [];
  
      // Append new data
      const updatedData = [...parsedData, dataToSave];
  
      // Save updated data back to AsyncStorage
      await AsyncStorage.setItem("savedData", JSON.stringify(updatedData));
  
      // Navigate to HistoryScreen
      navigation.navigate("MainScreen", { selectedDate });
  
      Alert.alert("Success", "Your data has been saved!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while saving your data. Please try again.");
    }
  };
  

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Selected Emotions:</Text>

        {mainEmotion && (
          <View style={styles.mainEmotionDisplay}>
            <Text style={styles.mainEmotionText}>{mainEmotion}</Text>
          </View>
        )}

        {selectedDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Date: {formatDate(new Date(selectedDate))}</Text>
          </View>
        )}

        {Object.keys(selectedValues || {}).map((buttonIndex) => {
          const selectedItems = selectedValues[buttonIndex] || [];
          return (
            selectedItems.length > 0 && (
              <View key={buttonIndex} style={styles.buttonSection}>
                <Text style={styles.buttonLabel}>{buttonNames[buttonIndex]}</Text>
                <View style={styles.selectedButtonRow}>
                  {selectedItems.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={itemIndex}
                      style={styles.selectedButton}
                      onPress={() => handleButtonPress(buttonIndex)}
                    >
                      <Text style={styles.selectedButtonText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {dropdownVisible === parseInt(buttonIndex) && (
                  <View style={styles.dropdownContainer}>
                    <FlatList
                      data={Finaloption[buttonIndex]}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => handleOptionSelect(buttonIndex, item)}
                        >
                          <Text style={styles.dropdownItemText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                )}
              </View>
            )
          );
        })}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Would You Like To Add Reason?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Add Reason"
            placeholderTextColor="#888"
            value={reason}
            onChangeText={setReason}
          />

          <Text style={styles.inputLabel}>Would You Like To Add Action?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Add Action"
            placeholderTextColor="#888"
            value={action}
            onChangeText={setAction}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  mainEmotionDisplay: {
    marginBottom: 20,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainEmotionText: {
    fontSize: 18,
    color: "#007BFF",
    fontWeight: "600",
  },
  dateContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#e3f2fd",
    borderColor: "#0288d1",
    alignItems: "center",
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  buttonSection: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
  },
  buttonLabel: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: 'center',
    color: "black",
    fontWeight: "bold",
  },
  selectedButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedButton: {
    backgroundColor: "#e0f7fa",
    padding: 12,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  selectedButtonText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: 'bold',
  },
  dropdownContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#0288d1",
    borderRadius: 12,
    backgroundColor: "#e3f2fd",
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0056b3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FinalScreen;
