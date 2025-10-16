import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";

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

export default function EnhancedNoteApp() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedTaskHistory, setSelectedTaskHistory] = useState<any>(null);

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

  const handleShowHistory = (task: any) => {
    setSelectedTaskHistory(task);
    setShowHistoryModal(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      <FloatingBackground />

      <MainHeader />

      <View style={styles.content}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
        />

        {/* Ganti TaskInput dengan AddTaskButton */}
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
          renderItem={({ item, index }) => (
            <TaskItem
              item={item}
              index={index}
              onToggleCompletion={toggleTaskCompletion}
              onToggleArchive={toggleArchiveTask}
              onDelete={deleteTask}
              onUpdateText={updateTaskText}
              onUpdateFootnote={updateFootnote}
              onShowHistory={handleShowHistory}
              editingTaskId={editingTaskId}
              onStartEditing={handleStartEditing}
              onSaveEditing={handleSaveEditing}
              editedText={editedText}
              setEditedText={setEditedText}
            />
          )}
          ListEmptyComponent={<EmptyState searchQuery={searchQuery} />}
        />
      </View>

      {/* Modal untuk menambah task baru */}
      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={handleAddTask}
      />

      {/* Modal untuk melihat history */}
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
    padding: 20,
    zIndex: 1,
  },
});
