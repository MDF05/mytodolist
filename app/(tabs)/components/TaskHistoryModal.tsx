import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TaskNote } from "../types/task.types";
import CustomModal from "./CustomModal";

const { width, height } = Dimensions.get("window");
const isMobile = width < 768;

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
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString("id-ID"),
        time: date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (error) {
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  // Jika tidak ada task yang dipilih, tampilkan modal kosong
  if (!selectedTask) {
    return (
      <CustomModal visible={visible} onClose={onClose}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.modalHeader}
          >
            <Text style={[
              styles.modalTitle,
              isMobile && styles.modalTitleMobile
            ]}>Riwayat Perubahan</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={isMobile ? 18 : 20} color="white" />
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Tidak ada data riwayat</Text>
          </View>
        </View>
      </CustomModal>
    );
  }

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <View style={styles.modalContent}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.modalHeader}
        >
          <View style={styles.headerContent}>
            <Text style={[
              styles.modalTitle,
              isMobile && styles.modalTitleMobile
            ]}>Riwayat Perubahan</Text>
            <Text style={styles.taskTitle} numberOfLines={1}>
              "{selectedTask.text}"
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={isMobile ? 18 : 20} color="white" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView 
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.historyListContent}
        >
          {selectedTask.history && selectedTask.history.length > 0 ? (
            selectedTask.history
              .slice() // Create a copy to avoid mutating the original array
              .reverse() // Show latest first
              .map((historyItem, index) => (
                <View 
                  key={historyItem.id || `history-${index}`} 
                  style={[
                    styles.historyItem,
                    isMobile && styles.historyItemMobile
                  ]}
                >
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyVersion}>
                      Versi {selectedTask.history.length - index}
                    </Text>
                    <Text style={styles.historyTimestamp}>
                      {formatDate(historyItem.timestamp).date} • {formatDate(historyItem.timestamp).time}
                    </Text>
                  </View>
                  <Text style={[
                    styles.historyText,
                    isMobile && styles.historyTextMobile
                  ]}>
                    {historyItem.text}
                  </Text>
                  {index === 0 && (
                    <View style={styles.currentVersionBadge}>
                      <Text style={styles.currentVersionText}>VERSI SAAT INI</Text>
                    </View>
                  )}
                </View>
              ))
          ) : (
            <View style={styles.emptyHistory}>
              <FontAwesome name="history" size={40} color="#ddd" />
              <Text style={styles.emptyHistoryText}>Belum ada riwayat perubahan</Text>
              <Text style={styles.emptyHistorySubtext}>
                Riwayat akan tercatat ketika Anda mengubah catatan
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: isMobile ? '85%' : '80%',
    minHeight: isMobile ? '50%' : '50%',
    overflow: "hidden",   
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: isMobile ? 14 : 18,
  },
  headerContent: {
    flex: 1,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  modalTitleMobile: {
    fontSize: 16,
  },
  taskTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontStyle: "italic",
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 4,
  },
  historyList: {
    flex: 1,
  },
  historyListContent: {
    padding: isMobile ? 16 : 20,
    paddingBottom: 30,
  },
  historyItem: {
    backgroundColor: "#f8f9fa",
    padding: isMobile ? 14 : 16,
    borderRadius: 12,
    marginBottom: isMobile ? 12 : 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4a90e2",
    position: "relative",
  },
  historyItemMobile: {
    padding: 12,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  historyVersion: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  historyTimestamp: {
    fontSize: 10,
    color: "#888",
    fontStyle: "italic",
  },
  historyText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  historyTextMobile: {
    fontSize: 13,
    lineHeight: 18,
  },
  currentVersionBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#28a745",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentVersionText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "white",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptyHistory: {
    alignItems: "center",
    padding: 40,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default TaskHistoryModal;