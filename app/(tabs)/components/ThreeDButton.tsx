import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

interface ThreeDButtonProps {
  onPress: () => void;
  title: string;
  icon?: keyof typeof FontAwesome.glyphMap;
  color: string;
  style?: object;
  small?: boolean;
}

const ThreeDButton: React.FC<ThreeDButtonProps> = ({
  onPress,
  title,
  icon,
  color,
  style = {},
  small = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isPressed ? 0.95 : 1) }],
      shadowOpacity: withSpring(isPressed ? 0.2 : 0.3),
    };
  });

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.threeDButton,
          { backgroundColor: color },
          style,
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[color, `${color}dd`]}
          style={[styles.buttonGradient, small && styles.smallButtonGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {icon && (
            <FontAwesome
              name={icon}
              size={small ? 14 : 16}
              color="white"
              style={styles.buttonIcon}
            />
          )}
          {title ? (
            <Text
              style={[styles.threeDButtonText, small && styles.smallButtonText]}
            >
              {title}
            </Text>
          ) : null}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  threeDButton: {
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  smallButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  threeDButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  smallButtonText: {
    fontSize: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ThreeDButton;
