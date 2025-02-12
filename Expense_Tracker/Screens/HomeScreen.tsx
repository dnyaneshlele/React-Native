  import React, { useEffect, useState } from "react";
  import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
  import { StackNavigationProp, RouteProp } from "@react-navigation/stack";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { Picker } from '@react-native-picker/picker';

  type RootStackParamList = {
    HomeScreen: { selectedCategory?: string } | undefined;
    AddExpenseScreen: undefined;
  };

  type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "HomeScreen">;
  type HomeScreenRouteProp = RouteProp<RootStackParamList, "HomeScreen">;

  type ExpenseData = {
    amount: string;
    date: string;
  };

  export default function HomeScreen() {
    const [categoryExpenses, setCategoryExpenses] = useState<{ [key: string]: ExpenseData[] }>({});
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth()).toString());
    const [filteredData, setFilteredData] = useState<ExpenseData[]>([]);
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
  
    // Extract the selected category from the route
    const selectedCategory = route.params?.selectedCategory;
  
    const fetchExpensesData = async () => {
      try {
        const existingData = await AsyncStorage.getItem("expensesData");
        const parsedData = existingData ? JSON.parse(existingData) : {};
        setCategoryExpenses(parsedData);
        } catch (error) {
        console.error("Error fetching expense data", error);
      }
    };
  
    const filterDataByMonth = (month: string) => {
      const filtered: ExpenseData[] = [];
      Object.keys(categoryExpenses).forEach((category) => {
        categoryExpenses[category].forEach((expense) => {
          const expenseDate = new Date(expense.date);
          if (expenseDate.getMonth() === parseInt(month)) {
            filtered.push({ ...expense, category });
          }
        });
      });
      setFilteredData(filtered);
    };
  
    useEffect(() => {
      fetchExpensesData();
    }, []);
  
    useEffect(() => {
      filterDataByMonth(selectedMonth);
    }, [selectedMonth, categoryExpenses]);
  
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Monthly Expenses</Text>
        {/* Display selected category */}
        {selectedCategory && (
          <Text style={styles.categoryText}>Category: {selectedCategory}</Text>
        )}
  
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue.toString())}
          style={styles.picker}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Picker.Item key={i} label={new Date(0, i).toLocaleString('default', { month: 'long' })} value={i.toString()} />
          ))}
        </Picker>
  
        <ScrollView style={styles.expensesContainer}>
          {filteredData.length > 0 ? (
            filteredData.map((expense, index) => (
              <View key={index} style={styles.expenseItem}>
                <Text style={styles.categoryTextInCard}>Category: {expense.category}</Text>
                <Text style={styles.expenseText}>
                  Amount: <Text style={styles.amountText}>{expense.amount}</Text>
                </Text>
                <Text style={styles.dateText}>Date: {expense.date}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noExpensesText}>No expenses recorded for this month.</Text>
          )}
        </ScrollView>
  
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddExpenseScreen")}
        >
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#e3f2fd",
    },
    headerText: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#0277bd",
    },
    categoryText: {
      fontSize: 18,
      color: "#37474f",
      marginBottom: 10,
    },
    picker: {
      width: "100%",
      height: 70,
      borderWidth: 1,
      borderColor: "#0277bd",
      borderRadius: 8,
      marginBottom: 20,
      backgroundColor: "#ffffff",
      paddingHorizontal: 10,
    },
    expensesContainer: {
      width: "100%",
      marginBottom: 20,
      paddingVertical: 10,
    },
    expenseItem: {
      backgroundColor: "#ffffff",
      padding: 15,
      borderRadius: 8,
      marginVertical: 8,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    categoryTextInCard: {
      fontSize: 16,
      color: "#0277bd",
      fontWeight: "bold",
    },
    expenseText: {
      fontSize: 16,
      color: "#37474f",
    },
    amountText: {
      fontWeight: "bold",
      color: "#388e3c",
    },
    dateText: {
      fontSize: 14,
      color: "#757575",
      marginTop: 4,
    },
    noExpensesText: {
      fontSize: 16,
      color: "#757575",
      marginTop: 10,
      fontStyle: "italic",
    },
    addButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: "#388e3c",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      marginTop: 20,
    },
    addButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });