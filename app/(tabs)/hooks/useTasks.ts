import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskNote, Filter, SortOrder } from "../types/task.types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskNote[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("NEWEST");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const addTask = (taskText: string, footnoteText: string = "") => {
    if (taskText.trim().length > 0) {
      const now = new Date().toISOString();
      const newTask: TaskNote = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        archived: false,
        footnote: footnoteText.trim(),
        createdAt: now,
        updatedAt: now,
        history: [{ id: "1", text: taskText, timestamp: now }],
      };
      setTasks([...tasks, newTask]);
      return true;
    }
    return false;
  };

  const deleteTask = (id: string) => {
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

  const updateTaskText = (id: string, newText: string) => {
    const now = new Date().toISOString();
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const updatedHistory = [
            ...task.history,
            { id: Date.now().toString(), text: newText, timestamp: now },
          ];
          return {
            ...task,
            text: newText,
            updatedAt: now,
            history: updatedHistory,
          };
        }
        return task;
      })
    );
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

  // 🎯 PERBAIKAN UTAMA: Logika filter yang diperbaiki
  const filteredTasks = tasks
    .filter((task) => {
      // 1. Filter berdasarkan status arsip
      // Di filter "ALL" dan lainnya, jangan tampilkan yang diarsip
      // Kecuali di filter "ARCHIVED" khusus
      if (filter !== "ARCHIVED" && task.archived) {
        return false;
      }

      if (filter === "ARCHIVED" && !task.archived) {
        return false;
      }

      // 2. Filter pencarian
      const searchLower = searchQuery.toLowerCase();
      if (searchLower.length > 0) {
        const textMatches = task.text.toLowerCase().includes(searchLower);
        const footnoteMatches = task.footnote
          .toLowerCase()
          .includes(searchLower);
        if (!textMatches && !footnoteMatches) {
          return false;
        }
      }

      // 3. Filter status completion
      if (filter === "COMPLETED") return task.completed && !task.archived;
      if (filter === "INCOMPLETE") return !task.completed && !task.archived;

      // Untuk filter "ALL" dan "ARCHIVED", semua task yang lolos filter di atas akan ditampilkan
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortOrder === "NEWEST") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  return {
    tasks,
    filteredTasks,
    filter,
    sortOrder,
    searchQuery,
    setFilter,
    setSortOrder,
    setSearchQuery,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    toggleArchiveTask,
    updateTaskText,
    updateFootnote,
  };
};
