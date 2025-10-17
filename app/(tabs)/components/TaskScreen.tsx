import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TaskNote } from '../types/task.types';
import TaskItem from '../components/TaskItem';
import TaskHistoryModal from '../components/TaskHistoryModal'; // Pastikan import ini

const { width } = Dimensions.get('window');

const TaskScreen: React.FC = () => {
  // States
  const [tasks, setTasks] = useState<TaskNote[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskNote | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

  // Load tasks (contoh)
  useEffect(() => {
    // Your existing load tasks logic
  }, []);

  // Add new task
  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;

    const newTask: TaskNote = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      archived: false,
      footnote: '',
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
  };

  // Toggle completion
  const handleToggleCompletion = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
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

  // Toggle archive
  const handleToggleArchive = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
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

  // Delete task
  const handleDelete = (id: string) => {
    Alert.alert(
      'Hapus Task',
      'Apakah Anda yakin ingin menghapus task ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
          },
        },
      ]
    );
  };

  // Update text (untuk footnote dll)
  const handleUpdateText = (id: string, text: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? {
              ...task,
              text,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  // Update footnote
  const handleUpdateFootnote = (id: string, footnote: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? {
              ...task,
              footnote,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  // Start editing
  const handleStartEditing = (id: string, text: string) => {
    setEditingTaskId(id);
    setEditedText(text);
  };

  // ✅✅✅ INI YANG PERLU DIUPDATE - handleSaveEditing dengan deteksi duplikat
  const handleSaveEditing = (id: string, newText: string) => {
    console.log('=== SAVE EDITING DIPANGGIL ===');
    console.log('Task ID:', id);
    
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const currentText = task.text;
          console.log('Current text:', `"${currentText}"`);
          console.log('New text:', `"${newText}"`);
          
          // Normalisasi teks untuk perbandingan
          const normalizeText = (text: string) =>
            text.trim().toLowerCase().replace(/\s+/g, ' ');
          
          const currentNormalized = normalizeText(currentText);
          const newNormalized = normalizeText(newText);
          
          console.log('Normalized current:', `"${currentNormalized}"`);
          console.log('Normalized new:', `"${newNormalized}"`);
          console.log('Is duplicate?', currentNormalized === newNormalized);
          
          // Cek duplikat - JIKA SAMA, tidak simpan history
          if (currentNormalized === newNormalized) {
            console.log('🚫 DUPLICATE - Tidak simpan history');
            // Tetap update teks (untuk formatting changes) tapi tidak simpan history
            return {
              ...task,
              text: newText,
              updatedAt: new Date().toISOString(),
            };
          }
          
          console.log('✅ BEDA - Simpan ke history');
          // Simpan ke history
          const newHistoryEntry = {
            id: Date.now().toString(), // Tambah ID untuk key
            text: currentText, // Simpan teks LAMA ke history
            timestamp: new Date().toISOString(),
            version: `Versi ${task.history.length + 1}`,
          };
          
          return {
            ...task,
            text: newText,
            history: [...task.history, newHistoryEntry],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    
    setEditingTaskId(null);
    setEditedText('');
  };

  // Show history
  const handleShowHistory = (task: TaskNote) => {
    setSelectedTask(task);
    setIsHistoryModalVisible(true);
  };

  // Close history modal
  const handleCloseHistoryModal = () => {
    setIsHistoryModalVisible(false);
    setSelectedTask(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📝 Task Manager</Text>
        <Text style={styles.subtitle}>Kelola tugas harian Anda</Text>
      </View>

      {/* Add Task Input */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.addTaskContainer}>
        <TextInput
          style={styles.textInput}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder="Tambah task baru..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <LinearGradient
            colors={['#4a90e2', '#357abd']}
            style={styles.addButtonGradient}
          >
            <FontAwesome name="plus" size={18} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Belum ada task</Text>
            <Text style={styles.emptyStateSubtext}>
              Tambahkan task baru untuk memulai
            </Text>
          </View>
        ) : (
          tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              item={task}
              index={index}
              onToggleCompletion={handleToggleCompletion}
              onToggleArchive={handleToggleArchive}
              onDelete={handleDelete}
              onUpdateText={handleUpdateText}
              onUpdateFootnote={handleUpdateFootnote}
              onShowHistory={handleShowHistory}
              editingTaskId={editingTaskId}
              onStartEditing={handleStartEditing}
              onSaveEditing={handleSaveEditing} // ✅ INI YANG SUDAH DIPERBAIKI
              editedText={editedText}
              setEditedText={setEditedText}
            />
          ))
        )}
      </ScrollView>

      {/* History Modal */}
      <TaskHistoryModal
        visible={isHistoryModalVisible}
        onClose={handleCloseHistoryModal}
        selectedTask={selectedTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  addTaskContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  addButton: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});

export default TaskScreen;