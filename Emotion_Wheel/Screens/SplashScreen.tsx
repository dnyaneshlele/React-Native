import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Easing } from "react-native-reanimated";
import AppLoading from "expo-app-loading";
import { useFonts, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  SplashScreen: undefined;
  MainScreen: undefined;
};

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SplashScreen">;
};

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const logoScale = new Animated.Value(0);
  const logoBounce = new Animated.Value(0);
  const taglineOpacity = new Animated.Value(0);
  const taglineTranslateY = new Animated.Value(20);

  const [fontsLoaded] = useFonts({ Poppins_600SemiBold });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.sequence([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoBounce, {
          toValue: 1,
          duration: 800,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(taglineTranslateY, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Navigate to MainScreen after 4000ms
      setTimeout(() => {
        navigation.replace("MainScreen");
      }, 5000);
    }
  }, [fontsLoaded, navigation]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <LinearGradient
      colors={["#6C5B7B", "#355C7D", "#FF7E5F"]}
      start={[0.8, 0.2]}
      end={[0.2, 1]}
      style={styles.container}
    >
      <View style={styles.centeredView}>
        <Animated.Image
          source={require("../assets/emotions.png")}
          style={[
            styles.logo,
            {
              transform: [
                { scale: logoScale },
                {
                  translateY: logoBounce.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineTranslateY }],
            },
          ]}
        >
          "Explore the Colors of Your Feelings!"
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 40,
    resizeMode: "contain",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  tagline: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 30,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
