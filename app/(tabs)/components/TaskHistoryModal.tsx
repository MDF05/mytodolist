import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { SlideInRight } from "react-native-reanimated";
import { TaskNote } from "../types/task.types";

interface TaskHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTask: TaskNote | null;
}

const TaskHistoryModal: React.FC<TaskHistoryModalProps> = ({
  visible,
  onClose,
  selectedTask,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("id-ID"),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={SlideInRight.duration(500)}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Riwayat Perubahan</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedTask && (
            <ScrollView style={styles.historyList}>
              {selectedTask.history
                .slice()
                .reverse()
                .map((historyItem, index) => (
                  <View key={historyItem.id} style={styles.historyItem}>
                    <Text style={styles.historyVersion}>
                      Versi {selectedTask.history.length - index}
                    </Text>
                    <Text style={styles.historyText}>{historyItem.text}</Text>
                    <Text style={styles.historyTimestamp}>
                      {formatDate(historyItem.timestamp).date} -{" "}
                      {formatDate(historyItem.timestamp).time}
                    </Text>
                  </View>
                ))}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  historyList: {
    maxHeight: "80%",
  },
  historyItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#4a90e2",
  },
  historyVersion: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 5,
  },
  historyText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  historyTimestamp: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
  },
});

export default TaskHistoryModal;
