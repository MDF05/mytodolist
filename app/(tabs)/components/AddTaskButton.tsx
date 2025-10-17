import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import ThreeDButton from "./ThreeDButton";

const { width } = Dimensions.get("window");
const isMobile = width < 768;

interface AddTaskButtonProps {
  onPress: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onPress }) => {
  return (
    <Animated.View entering={ZoomIn.duration(600)} style={styles.buttonContainer}>
      <ThreeDButton
        onPress={onPress}
        title="+ Tambah Catatan Baru"
        icon="plus-circle"
        color="#28a745"
        style={styles.addButton}
        small={isMobile}
      />
      <Text style={[
        styles.hintText,
        isMobile && styles.hintTextMobile
      ]}>
        Ketuk untuk membuat catatan baru
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    marginBottom: isMobile ? 15 : 20,
    paddingHorizontal: isMobile ? 10 : 0,
  },
  addButton: {
    minWidth: isMobile ? 180 : 220,
    marginBottom: isMobile ? 6 : 8,
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  hintTextMobile: {
    fontSize: 11,
  },
});

export default AddTaskButton;