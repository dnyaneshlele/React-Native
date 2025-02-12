import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddExpenseScreen({ navigation }: any) {
  const categories = ["Fuel", "Food", "Entertainment", "Turf", "Self", "Shopping"];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryExpenses, setCategoryExpenses] = useState<{ [key: string]: { amount: string; date: string }[] }>({});

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const existingData = await AsyncStorage.getItem("expensesData");
      const parsedData = existingData ? JSON.parse(existingData) : {};
      setCategoryExpenses(parsedData);
    } catch (error) {
      console.error("Error loading expenses data", error);
    }
  };

  const handleSaveExpense = async () => {
    if (!selectedCategory || !amount) {
      Alert.alert("Error", "Please select a category and enter an amount.");
      return;
    }
  
    const newExpense = { amount, date: selectedDate.toDateString() };
  
    try {
      const existingData = await AsyncStorage.getItem("expensesData");
      const parsedData = existingData ? JSON.parse(existingData) : {};
  
      // Add the new expense under the selected category
      const updatedData = {
        ...parsedData,
        [selectedCategory]: [...(parsedData[selectedCategory] || []), newExpense],
      };
  
      // Save the updated data back to AsyncStorage
      await AsyncStorage.setItem("expensesData", JSON.stringify(updatedData));
  
      // Update state
      setCategoryExpenses(updatedData);
      setAmount(""); // Clear amount field
      setSelectedCategory(null); // Reset category selection
  
      Alert.alert("Success", "Expense saved successfully!");
  
      // Pass the selected category data to the HomeScreen
      navigation.navigate("HomeScreen", { selectedCategory, expenses: updatedData[selectedCategory] });
  
    } catch (error) {
      console.error("Error saving expense data", error);
      Alert.alert("Error", "An error occurred while saving the expense.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("HomeScreen" , selectedCategory)}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.selectDate}>Select Date</Text>
      <TouchableOpacity style={styles.datePickerField} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            if (date) {
              setSelectedDate(date);
              setShowDatePicker(false);
            }
          }}
        />
      )}

      <Text style={styles.label}>Select Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCategory && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter {selectedCategory} Expense</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
      )}

      {selectedCategory && amount ? (
        <TouchableOpacity style={styles.button} onPress={handleSaveExpense}>
          <Text style={styles.buttonText}>Save Expense</Text>
        </TouchableOpacity>
      ) : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "flex-start",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#00796B",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
    marginTop: 15,
  },
  backText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectDate: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#37474f",
    textAlign: "center",
    marginTop: 10,
  },
  datePickerField: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#00796B",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#00796B",
    fontWeight: "600",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryButton: {
    width: "45%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00796B",
    backgroundColor: "#ffffff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  selectedCategory: {
    backgroundColor: "#00796B",
  },
  categoryText: {
    fontSize: 16,
    color: "#00796B",
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#ffffff",
  },
  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: "#00796B",
    backgroundColor: "#ffffff",
    marginBottom: 20,
    fontSize: 16,
    color: "#37474f",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00796B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  expenseHeader: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
    color: "#37474f",
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796B",
    marginTop: 10,
  },
  expenseItem: {
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  expenseText: {
    fontSize: 14,
    color: "#37474f",
  },
  noExpensesText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#00796B",
    fontWeight: "bold",
    textAlign: "center",
  },
});