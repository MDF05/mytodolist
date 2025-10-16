import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { BounceIn } from "react-native-reanimated";

const MainHeader: React.FC = () => {
  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
      <Animated.Text entering={BounceIn.duration(1000)} style={styles.title}>
        ✨ MDF Catatan
      </Animated.Text>
      <Text style={styles.subtitle}>
        Kelola tugas dan ide Saya dengan mudah
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
  },
});

export default MainHeader;
