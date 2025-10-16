import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const FloatingBackground: React.FC = () => {
  return (
    <View style={styles.backgroundAnimation}>
      {[...Array(15)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingElement,
            {
              top: Math.random() * height,
              left: Math.random() * width,
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              backgroundColor: `rgba(74, 144, 226, ${
                Math.random() * 0.1 + 0.05
              })`,
              borderRadius: Math.random() * 30 + 10,
            },
          ]}
          entering={FadeIn.duration(2000 + Math.random() * 2000)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundAnimation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingElement: {
    position: "absolute",
    opacity: 0.3,
  },
});

export default FloatingBackground;
