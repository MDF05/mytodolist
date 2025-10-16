import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import ThreeDButton from "./ThreeDButton";

interface AddTaskButtonProps {
  onPress: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onPress }) => {
  return (
    <Animated.View
      entering={ZoomIn.duration(600)}
      style={styles.buttonContainer}
    >
      <ThreeDButton
        onPress={onPress}
        title="Tambah Catatan Baru"
        icon="plus-circle"
        color="#28a745"
        style={styles.addButton}
      />
      <Text style={styles.hintText}>Tekan untuk menambahkan catatan baru</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  addButton: {
    minWidth: 200,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default AddTaskButton;
