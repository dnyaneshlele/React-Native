import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;  
  SettingsScreen: undefined;
  AddExpenseScreen:undefined;
};

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SplashScreen">;
};

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const logoScale = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  const textTranslateY = new Animated.Value(20);

  const [fontsLoaded] = useFonts({ Poppins_600SemiBold });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.sequence([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateY, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
  
      // Ensure navigation happens only after animation finishes
      const timer = setTimeout(() => {
        navigation.replace("HomeScreen"); 
      }, 3500);
  
      return () => clearTimeout(timer); // Cleanup
    }
  }, [fontsLoaded, navigation]);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#F0F4F8", "#FFFFFF"]} style={styles.container}>
      {/* Animated Logo */}
      <Animated.Image
        source={require("../assets/Expense.png")}
        style={[
          styles.logo,
          { transform: [{ scale: logoScale }] },
        ]}
      />

      {/* Catchy Tagline Animation */}
      <Animated.Text
        style={[
          styles.tagline,
          { opacity: textOpacity, transform: [{ translateY: textTranslateY }] },
        ]}
      >
        "Track Smart, Spend Wise!"
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  tagline: {
    fontSize: 20,
    color: "#00796B",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Poppins_600SemiBold",
  },
});
