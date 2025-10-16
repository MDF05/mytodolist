import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

interface EmptyStateProps {
  searchQuery: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery }) => {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.emptyState}>
      <FontAwesome name="sticky-note-o" size={50} color="#ddd" />
      <Text style={styles.emptyStateText}>
        {searchQuery ? "Tidak ada catatan yang cocok" : "Belum ada catatan"}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery
          ? "Coba kata kunci lain"
          : "Tambahkan catatan pertama Anda!"}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default EmptyState;
