import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { SlideInUp, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import ThreeDButton from "./ThreeDButton";

const { width } = Dimensions.get("window");

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (taskText: string, footnoteText: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAddTask,
}) => {
  const [task, setTask] = React.useState<string>("");
  const [footnote, setFootnote] = React.useState<string>("");
  const [isAddingFootnote, setIsAddingFootnote] =
    React.useState<boolean>(false);

  const handleAddTask = () => {
    if (task.trim().length > 0) {
      onAddTask(task, footnote);
      setTask("");
      setFootnote("");
      setIsAddingFootnote(false);
      onClose();
    }
  };

  const handleClose = () => {
    setTask("");
    setFootnote("");
    setIsAddingFootnote(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <Animated.View
          entering={SlideInUp.duration(500)}
          style={styles.modalContent}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Tambah Catatan Baru</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.modalBody}>
            <TextInput
              style={styles.input}
              placeholder="Tulis catatan Anda di sini..."
              value={task}
              onChangeText={setTask}
              multiline
              autoFocus
              numberOfLines={3}
            />

            {isAddingFootnote && (
              <Animated.View
                entering={FadeIn.duration(300)}
                style={styles.footnoteInputContainer}
              >
                <Text style={styles.footnoteLabel}>Catatan Kaki:</Text>
                <TextInput
                  style={styles.footnoteInput}
                  placeholder="Tambahkan catatan kaki (opsional)..."
                  value={footnote}
                  onChangeText={setFootnote}
                  multiline
                  numberOfLines={2}
                />
              </Animated.View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setIsAddingFootnote(!isAddingFootnote)}
                style={[
                  styles.footnoteToggle,
                  isAddingFootnote && styles.footnoteToggleActive,
                ]}
              >
                <FontAwesome
                  name="sticky-note-o"
                  size={16}
                  color={isAddingFootnote ? "#4a90e2" : "#666"}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.footnoteToggleText,
                    isAddingFootnote && styles.footnoteToggleTextActive,
                  ]}
                >
                  {isAddingFootnote ? "Sembunyikan" : "Tambahkan"} Catatan Kaki
                </Text>
              </TouchableOpacity>

              <View style={styles.actionButtons}>
                <ThreeDButton
                  onPress={handleClose}
                  title="Batal"
                  icon="times"
                  color="#6c757d"
                  style={styles.cancelButton}
                />
                <ThreeDButton
                  onPress={handleAddTask}
                  title="Simpan"
                  icon="check"
                  color="#28a745"
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
  },
  footnoteInputContainer: {
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#4a90e2",
    paddingLeft: 10,
  },
  footnoteLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
  },
  footnoteInput: {
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
    color: "#666",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footnoteToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
  },
  footnoteToggleActive: {
    backgroundColor: "#e3f2fd",
    borderColor: "#4a90e2",
    borderWidth: 1,
  },
  footnoteToggleText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#666",
  },
  footnoteToggleTextActive: {
    color: "#4a90e2",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    minWidth: 80,
  },
});

export default AddTaskModal;
