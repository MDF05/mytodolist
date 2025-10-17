import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
} from "react-native";

import { useTasks } from "./hooks/useTasks";
import FloatingBackground from "./components/FloatingBackground";
import MainHeader from "./components/MainHeader";
import SearchBar from "./components/SearchBar";
import AddTaskButton from "./components/AddTaskButton";
import AddTaskModal from "./components/AddTaskModal";
import FilterButtons from "./components/FilterButtons";
import TaskItem from "./components/TaskItem";
import TaskHistoryModal from "./components/TaskHistoryModal";
import EmptyState from "./components/EmptyState";
import { TaskNote } from "./types/task.types";

export default function EnhancedNoteApp() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedTaskHistory, setSelectedTaskHistory] = useState<TaskNote | null>(null);

  const {
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
  } = useTasks();

  const handleAddTask = (taskText: string, footnoteText: string) => {
    addTask(taskText, footnoteText);
  };

  const handleStartEditing = (id: string, text: string) => {
    setEditingTaskId(id);
    setEditedText(text);
  };

  const handleSaveEditing = (id: string) => {
    updateTaskText(id, editedText);
    setEditingTaskId(null);
  };

  // 🎯 PERBAIKAN: Pastikan fungsi ini didefinisikan dengan benar
  const handleShowHistory = (task: TaskNote) => {
    setSelectedTaskHistory(task);
    setShowHistoryModal(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#667eea" 
        barStyle="light-content" 
      />
      
      <FloatingBackground />
      
      <MainHeader />

      <View style={styles.content}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
        />

        <AddTaskButton onPress={() => setShowAddModal(true)} />

        <FilterButtons
          filter={filter}
          sortOrder={sortOrder}
          onFilterChange={setFilter}
          onSortChange={setSortOrder}
        />

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.taskList}
          contentContainerStyle={filteredTasks.length === 0 && styles.emptyListContainer}
          renderItem={({ item, index }) => (
            <TaskItem
              item={item}
              index={index}
              onToggleCompletion={toggleTaskCompletion}
              onToggleArchive={toggleArchiveTask}
              onDelete={deleteTask}
              onUpdateText={updateTaskText}
              onUpdateFootnote={updateFootnote}
              onShowHistory={handleShowHistory} // 🎯 PASTIKAN INI ADA
              editingTaskId={editingTaskId}
              onStartEditing={handleStartEditing}
              onSaveEditing={handleSaveEditing}
              editedText={editedText}
              setEditedText={setEditedText}
            />
          )}
          ListEmptyComponent={
            <EmptyState searchQuery={searchQuery} />
          }
        />
      </View>

      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={handleAddTask}
      />

      <TaskHistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        selectedTask={selectedTaskHistory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    padding: 16,
    zIndex: 1,
  },
  taskList: {
    flex: 1,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});