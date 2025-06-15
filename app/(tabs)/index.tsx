import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type Filter = "ALL" | "COMPLETED" | "INCOMPLETE";

export default function App() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim().length > 0) {
      const newTask: Task = { id: Date.now().toString(), text: task, completed: false };
      setTasks([...tasks, newTask]);
      setTask("");
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const startEditing = (id: string, text: string) => {
    setEditingTaskId(id);
    setEditedText(text);
  };

  const saveEditedTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: editedText } : task)));
    setEditingTaskId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "COMPLETED") return task.completed;
    if (filter === "INCOMPLETE") return !task.completed;
    return true; // 'ALL'
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Tambahkan tugas..." value={task} onChangeText={setTask} />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter("ALL")} style={[styles.filterButton, filter === "ALL" && styles.activeFilter]}>
          <Text style={[styles.filterText, filter === "ALL" && styles.activeFilterText]}>Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("COMPLETED")} style={[styles.filterButton, filter === "COMPLETED" && styles.activeFilter]}>
          <Text style={[styles.filterText, filter === "COMPLETED" && styles.activeFilterText]}>Selesai</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("INCOMPLETE")} style={[styles.filterButton, filter === "INCOMPLETE" && styles.activeFilter]}>
          <Text style={[styles.filterText, filter === "INCOMPLETE" && styles.activeFilterText]}>Belum Selesai</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()} style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <FontAwesome name={item.completed ? "check-circle" : "circle-o"} size={20} color={item.completed ? "green" : "gray"} />
            </TouchableOpacity>

            {editingTaskId === item.id ? (
              <TextInput style={styles.editInput} value={editedText} onChangeText={setEditedText} onBlur={() => saveEditedTask(item.id)} autoFocus />
            ) : (
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.text}</Text>
            )}

            <View style={styles.actionButtons}>
              {editingTaskId === item.id ? (
                <TouchableOpacity onPress={() => saveEditedTask(item.id)}>
                  <FontAwesome name="check" size={20} color="green" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => startEditing(item.id, item.text)}>
                  <FontAwesome name="pencil" size={20} color="blue" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, backgroundColor: "#fff" },
  addButton: { marginLeft: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  addButtonText: { color: "#fff", fontSize: 20 },
  filterContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  filterButton: { padding: 8, borderRadius: 5, borderWidth: 1, borderColor: "#007bff" },
  activeFilter: { backgroundColor: "#007bff" },
  filterText: { fontSize: 14, color: "#007bff", fontWeight: "bold" },
  activeFilterText: { color: "#fff" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  taskText: { fontSize: 16, flex: 1, marginLeft: 10 },
  completedTask: { textDecorationLine: "line-through", color: "gray" },
  actionButtons: { flexDirection: "row", gap: 10 },
  editInput: { flex: 1, borderBottomWidth: 1, borderColor: "#007bff", padding: 5 },
});
