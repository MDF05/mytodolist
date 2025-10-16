import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  Layout,
  FadeIn,
  SlideInRight,
  ZoomIn,
  BounceIn,
  FlipInYRight,
  FlipOutYRight,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface TaskNote {
  id: string;
  text: string;
  completed: boolean;
  archived: boolean;
  footnote: string;
  createdAt: string;
  updatedAt: string;
  history: TaskHistory[];
}

interface TaskHistory {
  id: string;
  text: string;
  timestamp: string;
}

type Filter = "ALL" | "COMPLETED" | "INCOMPLETE" | "ARCHIVED";

// Komponen Button 3D yang terpisah
const ThreeDButton = ({
  onPress,
  title,
  icon,
  color,
  style = {},
  small = false,
}: {
  onPress: () => void;
  title: string;
  icon: keyof typeof FontAwesome.glyphMap;
  color: string;
  style?: object;
  small?: boolean;
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

export default function EnhancedNoteApp() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<TaskNote[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [footnote, setFootnote] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedTaskHistory, setSelectedTaskHistory] =
    useState<TaskNote | null>(null);
  const [isAddingFootnote, setIsAddingFootnote] = useState<boolean>(false);
  const isMobile = width < 600;

  const filterListButton: {
    key: string;
    label: string;
    icon: keyof typeof FontAwesome.glyphMap;
  }[] = [
    { key: "ALL", label: "Semua", icon: "list" },
    { key: "INCOMPLETE", label: "Aktif", icon: "clock-o" },
    { key: "COMPLETED", label: "Selesai", icon: "check-circle" },
    { key: "ARCHIVED", label: "Arsip", icon: "archive" },
    { key: "NEWEST", label: "Terbaru", icon: "sort-amount-desc" },
    { key: "OLDEST", label: "Terlama", icon: "sort-amount-asc" },
  ];

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("enhancedTasks");
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("enhancedTasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (task.trim().length > 0) {
      const now = new Date().toISOString();
      const newTask: TaskNote = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        archived: false,
        footnote: footnote.trim(),
        createdAt: now,
        updatedAt: now,
        history: [{ id: "1", text: task, timestamp: now }],
      };
      setTasks([...tasks, newTask]);
      setTask("");
      setFootnote("");
      setIsAddingFootnote(false);
    }
  };

  const deleteTask = (id: string) => {
    // Animasi yang diperbaiki
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const toggleArchiveTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              archived: !task.archived,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const startEditing = (id: string, text: string) => {
    setEditingTaskId(id);
    setEditedText(text);
  };

  const saveEditedTask = (id: string) => {
    const now = new Date().toISOString();
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const updatedHistory = [
            ...task.history,
            { id: Date.now().toString(), text: editedText, timestamp: now },
          ];
          return {
            ...task,
            text: editedText,
            updatedAt: now,
            history: updatedHistory,
          };
        }
        return task;
      })
    );
    setEditingTaskId(null);
  };

  const updateFootnote = (id: string, newFootnote: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              footnote: newFootnote,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const showTaskHistory = (task: TaskNote) => {
    setSelectedTaskHistory(task);
    setShowHistoryModal(true);
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

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "COMPLETED") return task.completed;
      if (filter === "INCOMPLETE") return !task.completed;
      if (filter === "ARCHIVED") return task.archived;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "NEWEST") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

  // Background animation component
  const FloatingBackgroundElements = () => (
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

  // Komponen Task Item yang terpisah untuk animasi yang lebih baik
  const TaskItem = ({ item, index }: { item: TaskNote; index: number }) => {
    const [isEditingFootnote, setIsEditingFootnote] = useState(false);
    const [tempFootnote, setTempFootnote] = useState(item.footnote);

    const handleSaveFootnote = () => {
      updateFootnote(item.id, tempFootnote);
      setIsEditingFootnote(false);
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
          <View
            style={[styles.taskHeaderParent, isMobile && { width: "100%" }]}
          >
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(item.id)}
              style={styles.checkboxContainer}
            >
              <LinearGradient
                colors={
                  item.completed
                    ? ["#28a745", "#20c997"]
                    : ["#e9ecef", "#dee2e6"]
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
                  onBlur={() => saveEditedTask(item.id)}
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
              onPress={() => toggleArchiveTask(item.id)}
              title=""
              icon={item.archived ? "link" : "archive"}
              color={item.archived ? "#ffc107" : "#6c757d"}
              small={true}
            />

            {!item.archived && (
              <>
                {editingTaskId === item.id ? (
                  <ThreeDButton
                    onPress={() => saveEditedTask(item.id)}
                    title=""
                    icon="check"
                    color="#28a745"
                    small={true}
                  />
                ) : (
                  <ThreeDButton
                    onPress={() => startEditing(item.id, item.text)}
                    title=""
                    icon="pencil"
                    color="#17a2b8"
                    small={true}
                  />
                )}
              </>
            )}

            <ThreeDButton
              onPress={() => deleteTask(item.id)}
              title=""
              icon="trash"
              color="#dc3545"
              small={true}
            />
          </View>
        </View>

        {/* Footnote */}

        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.footnoteContainer}
        >
          <Text style={styles.footnoteLabel}>Catatan Kaki:</Text>
          {isEditingFootnote ? (
            <View>
              <TextInput
                style={styles.footnoteEditInput}
                value={tempFootnote}
                onChangeText={setTempFootnote}
                multiline
                autoFocus
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
                  onPress={() => {
                    setIsEditingFootnote(false);
                    setTempFootnote(item.footnote);
                  }}
                  title="Batal"
                  icon="times"
                  color="#6c757d"
                  small={true}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingFootnote(true)}>
              <Text style={styles.footnoteText}>{item.footnote}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {!item.archived && editingTaskId !== item.id && (
          <TouchableOpacity
            onPress={() => {
              setTempFootnote("");
              setIsEditingFootnote(true);
            }}
            style={styles.addFootnoteButton}
          >
            <Text style={styles.addFootnoteText}>
              {tempFootnote == ""
                ? "+ Tambah Catatan Kaki"
                : "* Edit Catatan Kaki"}{" "}
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
          onPress={() => showTaskHistory(item)}
          style={styles.historyButton}
        >
          <Text style={styles.historyButtonText}>
            📝 Lihat Riwayat ({item.history.length} versi)
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FloatingBackgroundElements />

      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <Animated.Text entering={BounceIn.duration(1000)} style={styles.title}>
          ✨ Catatan Pintar
        </Animated.Text>
        <Text style={styles.subtitle}>
          Kelola tugas dan ide Anda dengan mudah
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <Animated.View
          entering={SlideInRight.duration(500)}
          style={styles.searchContainer}
        >
          <FontAwesome
            name="search"
            size={16}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari catatan..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <FontAwesome name="times-circle" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Input Section */}
        <Animated.View entering={ZoomIn.duration(600)} style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Tambahkan catatan baru..."
            value={task}
            onChangeText={setTask}
            multiline
          />

          {isAddingFootnote && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.footnoteInputContainer}
            >
              <TextInput
                style={styles.footnoteInput}
                placeholder="Tambahkan catatan kaki..."
                value={footnote}
                onChangeText={setFootnote}
                multiline
              />
            </Animated.View>
          )}

          <View style={styles.inputActions}>
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
              />
              <Text
                style={[
                  styles.footnoteToggleText,
                  isAddingFootnote && styles.footnoteToggleTextActive,
                ]}
              >
                Catatan Kaki
              </Text>
            </TouchableOpacity>

            <ThreeDButton
              onPress={addTask}
              title="Tambah"
              icon="plus"
              color="#28a745"
            />
          </View>
        </Animated.View>

        {/* Filter Buttons */}
        <Animated.View
          entering={SlideInRight.duration(700)}
          style={styles.filterContainer}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterListButton.map((item) => {
              // cek apakah tombol ini adalah filter atau sort
              const isSort = item.key === "NEWEST" || item.key === "OLDEST";
              const isActive =
                (!isSort && filter === item.key) ||
                (isSort && sortOrder === item.key);

              return (
                <ThreeDButton
                  key={item.key}
                  onPress={() =>
                    isSort
                      ? setSortOrder(item.key as "NEWEST" | "OLDEST")
                      : setFilter(item.key as Filter)
                  }
                  title={item.label}
                  icon={item.icon}
                  color={isActive ? "#ff6b6b" : "#4a90e2"}
                  style={styles.filterButton}
                />
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Tasks List */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TaskItem item={item} index={index} />
          )}
          ListEmptyComponent={
            <Animated.View
              entering={FadeIn.duration(500)}
              style={styles.emptyState}
            >
              <FontAwesome name="sticky-note-o" size={50} color="#ddd" />
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? "Tidak ada catatan yang cocok"
                  : "Belum ada catatan"}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? "Coba kata kunci lain"
                  : "Tambahkan catatan pertama Anda!"}
              </Text>
            </Animated.View>
          }
        />
      </View>

      {/* History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={SlideInRight.duration(500)}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Riwayat Perubahan</Text>
              <TouchableOpacity
                onPress={() => setShowHistoryModal(false)}
                style={styles.closeButton}
              >
                <FontAwesome name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedTaskHistory && (
              <ScrollView style={styles.historyList}>
                {selectedTaskHistory.history
                  .slice()
                  .reverse()
                  .map((historyItem, index) => (
                    <View key={historyItem.id} style={styles.historyItem}>
                      <Text style={styles.historyVersion}>
                        Versi {selectedTaskHistory.history.length - index}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
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
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
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
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  inputCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: "top",
  },
  footnoteInputContainer: {
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#4a90e2",
    paddingLeft: 10,
  },
  footnoteInput: {
    fontSize: 14,
    minHeight: 40,
    textAlignVertical: "top",
    color: "#666",
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
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
    fontSize: 14,
    color: "#666",
  },
  footnoteToggleTextActive: {
    color: "#4a90e2",
    fontWeight: "bold",
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterButton: {
    marginRight: 10,
    minWidth: 100,
  },
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
    borderBottomWidth: 1,
    borderBottomColor: "#4a90e2",
    padding: 5,
    marginBottom: 8,
  },
  footnoteActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  addFootnoteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    alignSelf: "flex-start",
    marginBottom: 10,
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
