import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Layout,
  FlipInYRight,
  FlipOutYRight,
  FadeIn,
} from "react-native-reanimated";
import { TaskNote } from "../types/task.types";
import ThreeDButton from "./ThreeDButton";

const { width } = Dimensions.get("window");

interface TaskItemProps {
  item: TaskNote;
  index: number;
  onToggleCompletion: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onUpdateFootnote: (id: string, footnote: string) => void;
  onShowHistory: (task: TaskNote) => void;
  editingTaskId: string | null;
  onStartEditing: (id: string, text: string) => void;
  onSaveEditing: (id: string) => void;
  editedText: string;
  setEditedText: (text: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  item,
  index,
  onToggleCompletion,
  onToggleArchive,
  onDelete,
  onUpdateText,
  onUpdateFootnote,
  onShowHistory,
  editingTaskId,
  onStartEditing,
  onSaveEditing,
  editedText,
  setEditedText,
}) => {
  const [isEditingFootnote, setIsEditingFootnote] = useState(false);
  const [tempFootnote, setTempFootnote] = useState(item.footnote);
  const isMobile = width < 600;

  const handleSaveFootnote = () => {
    onUpdateFootnote(item.id, tempFootnote);
    setIsEditingFootnote(false);
  };

  const handleCancelFootnote = () => {
    setTempFootnote(item.footnote);
    setIsEditingFootnote(false);
  };

  const handleStartFootnoteEdit = () => {
    setTempFootnote(item.footnote);
    setIsEditingFootnote(true);
  };

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
    <Animated.View
      entering={FlipInYRight.duration(600).delay(index * 100)}
      exiting={FlipOutYRight.duration(400)}
      layout={Layout.springify()}
      style={[
        styles.taskCard,
        item.completed && styles.completedCard,
        item.archived && styles.archivedCard,
      ]}
    >
      {/* Task Header */}
      <View
        style={[
          styles.taskHeader,
          isMobile && {
            flexDirection: "column-reverse",
            gap: 20,
            marginBlockEnd: 20,
          },
        ]}
      >
        <View style={[styles.taskHeaderParent, isMobile && { width: "100%" }]}>
          <TouchableOpacity
            onPress={() => onToggleCompletion(item.id)}
            style={styles.checkboxContainer}
          >
            <LinearGradient
              colors={
                item.completed ? ["#28a745", "#20c997"] : ["#e9ecef", "#dee2e6"]
              }
              style={styles.checkbox}
            >
              {item.completed && (
                <FontAwesome name="check" size={12} color="white" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.taskTextContainer}>
            {editingTaskId === item.id ? (
              <TextInput
                style={styles.editInput}
                value={editedText}
                onChangeText={setEditedText}
                onBlur={() => onSaveEditing(item.id)}
                autoFocus
                multiline
              />
            ) : (
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTask,
                ]}
              >
                {item.text}
              </Text>
            )}
          </View>
        </View>

        <View
          style={[
            styles.taskActions,
            isMobile && {
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
            },
          ]}
        >
          <ThreeDButton
            onPress={() => onToggleArchive(item.id)}
            title=""
            icon={item.archived ? "link" : "archive"}
            color={item.archived ? "#ffc107" : "#6c757d"}
            small={true}
          />

          {!item.archived && (
            <>
              {editingTaskId === item.id ? (
                <ThreeDButton
                  onPress={() => onSaveEditing(item.id)}
                  title=""
                  icon="check"
                  color="#28a745"
                  small={true}
                />
              ) : (
                <ThreeDButton
                  onPress={() => onStartEditing(item.id, item.text)}
                  title=""
                  icon="pencil"
                  color="#17a2b8"
                  small={true}
                />
              )}
            </>
          )}

          <ThreeDButton
            onPress={() => onDelete(item.id)}
            title=""
            icon="trash"
            color="#dc3545"
            small={true}
          />
        </View>
      </View>

      {/* Footnote Section - PERBAIKAN DI SINI */}
      {isEditingFootnote ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.footnoteContainer}
        >
          <Text style={styles.footnoteLabel}>Catatan Kaki:</Text>
          <TextInput
            style={styles.footnoteEditInput}
            value={tempFootnote}
            onChangeText={setTempFootnote}
            multiline
            autoFocus
            placeholder="Tambahkan catatan kaki..."
          />
          <View style={styles.footnoteActions}>
            <ThreeDButton
              onPress={handleSaveFootnote}
              title="Simpan"
              icon="check"
              color="#28a745"
              small={true}
            />
            <ThreeDButton
              onPress={handleCancelFootnote}
              title="Batal"
              icon="times"
              color="#6c757d"
              small={true}
            />
          </View>
        </Animated.View>
      ) : item.footnote ? (
        // Menampilkan footnote yang sudah ada
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.footnoteContainer}
        >
          <Text style={styles.footnoteLabel}>Catatan Kaki:</Text>
          <TouchableOpacity onPress={handleStartFootnoteEdit}>
            <Text style={styles.footnoteText}>{item.footnote}</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      {/* Tombol Tambah/Edit Catatan Kaki - TAMPIL SELALU saat tidak sedang edit */}
      {!item.archived && editingTaskId !== item.id && !isEditingFootnote && (
        <TouchableOpacity
          onPress={handleStartFootnoteEdit}
          style={styles.addFootnoteButton}
        >
          <FontAwesome
            name={item.footnote ? "edit" : "plus"}
            size={12}
            color="#666"
            style={styles.footnoteIcon}
          />
          <Text style={styles.addFootnoteText}>
            {item.footnote ? "Edit Catatan Kaki" : "Tambah Catatan Kaki"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamps */}
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>
          Dibuat: {formatDate(item.createdAt).date}{" "}
          {formatDate(item.createdAt).time}
        </Text>
        {item.updatedAt !== item.createdAt && (
          <Text style={styles.timestamp}>
            Diubah: {formatDate(item.updatedAt).date}{" "}
            {formatDate(item.updatedAt).time}
          </Text>
        )}
      </View>

      {/* History Button */}
      <TouchableOpacity
        onPress={() => onShowHistory(item)}
        style={styles.historyButton}
      >
        <Text style={styles.historyButtonText}>
          📝 Lihat Riwayat ({item.history.length} versi)
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: "#4a90e2",
  },
  completedCard: {
    borderLeftColor: "#28a745",
    opacity: 0.8,
  },
  archivedCard: {
    borderLeftColor: "#ffc107",
    backgroundColor: "#fff9e6",
  },
  taskHeaderParent: {
    display: "flex",
    flexDirection: "row",
    width: width - 250,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  taskText: {
    fontSize: 16,
    lineHeight: 22,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  taskActions: {
    flexDirection: "row",
    gap: 5,
    width: 140,
    justifyContent: "space-evenly",
  },
  editInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#4a90e2",
    padding: 5,
    minHeight: 40,
    textAlignVertical: "top",
  },
  footnoteContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  footnoteLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  footnoteText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  footnoteEditInput: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "white",
    minHeight: 60,
    textAlignVertical: "top",
  },
  footnoteActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  addFootnoteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    alignSelf: "flex-start",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  footnoteIcon: {
    marginRight: 6,
  },
  addFootnoteText: {
    fontSize: 12,
    color: "#666",
  },
  timestampContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginBottom: 2,
  },
  historyButton: {
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  historyButtonText: {
    color: "#1976d2",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default TaskItem;
