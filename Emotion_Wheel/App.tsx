import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Use Native Stack for better performance in mobile
import MainScreen from "./Screens/MainScreen";
import FeelingScreen from "./Screens/FeelingScreen";
import HistoryScreen from "./Screens/HistoryScreen";
import FinalScreen from "./Screens/FinalScreen";
import SplashScreen from "./Screens/SplashScreen";

type RootStackParamList = {
  SplashScreen: undefined;
  MainScreen: undefined;
  FeelingScreen: undefined;
  FinalScreen: undefined;
  HistoryScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="FeelingScreen" component={FeelingScreen} />
        <Stack.Screen name="FinalScreen" component={FinalScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
