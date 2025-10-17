import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ThreeDButton from "./ThreeDButton";
import CustomModal from "./CustomModal";

const { width } = Dimensions.get("window");
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;
const isDesktop = width >= 1024;

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
  const [isAddingFootnote, setIsAddingFootnote] = React.useState<boolean>(false);

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
    <CustomModal visible={visible} onClose={handleClose}>
      <View style={[
        styles.modalContent,
        isDesktop && styles.modalContentDesktop,
        isTablet && styles.modalContentTablet
      ]}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={[
            styles.modalHeader,
            isDesktop && styles.modalHeaderDesktop,
            isTablet && styles.modalHeaderTablet
          ]}
        >
          <Text style={[
            styles.modalTitle,
            isMobile && styles.modalTitleMobile,
            isDesktop && styles.modalTitleDesktop,
            isTablet && styles.modalTitleTablet
          ]}>Tambah Catatan Baru</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <FontAwesome 
              name="times" 
              size={isDesktop ? 22 : isTablet ? 20 : 18} 
              color="white" 
            />
          </TouchableOpacity>
        </LinearGradient>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={Platform.OS === 'ios' ? (isDesktop ? 0 : 60) : 0}
        >
          <ScrollView 
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.modalBodyContent,
              isDesktop && styles.modalBodyContentDesktop,
              isTablet && styles.modalBodyContentTablet
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Input Catatan Utama */}
            <View style={styles.inputSection}>
              <Text style={[
                styles.inputLabel,
                isDesktop && styles.inputLabelDesktop,
                isTablet && styles.inputLabelTablet
              ]}>Catatan Utama *</Text>
              <TextInput
                style={[
                  styles.input,
                  isMobile && styles.inputMobile,
                  isDesktop && styles.inputDesktop,
                  isTablet && styles.inputTablet
                ]}
                placeholder="Tulis catatan Anda di sini..."
                value={task}
                onChangeText={setTask}
                multiline
                autoFocus={!isMobile}
                numberOfLines={isDesktop ? 6 : isTablet ? 5 : 4}
                textAlignVertical="top"
                returnKeyType="default"
              />
            </View>

            {/* Toggle Catatan Kaki */}
            <TouchableOpacity
              onPress={() => setIsAddingFootnote(!isAddingFootnote)}
              style={[
                styles.footnoteToggle,
                isAddingFootnote && styles.footnoteToggleActive,
                isMobile && styles.footnoteToggleMobile,
                isDesktop && styles.footnoteToggleDesktop,
                isTablet && styles.footnoteToggleTablet
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.footnoteToggleLeft}>
                <FontAwesome
                  name="sticky-note-o"
                  size={isDesktop ? 18 : isTablet ? 16 : 14}
                  color={isAddingFootnote ? "#4a90e2" : "#666"}
                  style={styles.footnoteToggleIcon}
                />
                <Text
                  style={[
                    styles.footnoteToggleText,
                    isMobile && styles.footnoteToggleTextMobile,
                    isDesktop && styles.footnoteToggleTextDesktop,
                    isTablet && styles.footnoteToggleTextTablet,
                    isAddingFootnote && styles.footnoteToggleTextActive,
                  ]}
                >
                  {isAddingFootnote ? "Sembunyikan Catatan Kaki" : "Tambahkan Catatan Kaki"}
                </Text>
              </View>
              <FontAwesome
                name={isAddingFootnote ? "chevron-up" : "chevron-down"}
                size={isDesktop ? 16 : isTablet ? 14 : 12}
                color={isAddingFootnote ? "#4a90e2" : "#666"}
              />
            </TouchableOpacity>

            {/* Input Catatan Kaki */}
            {isAddingFootnote && (
              <View style={[
                styles.footnoteInputContainer,
                isDesktop && styles.footnoteInputContainerDesktop,
                isTablet && styles.footnoteInputContainerTablet
              ]}>
                <Text style={[
                  styles.footnoteLabel,
                  isDesktop && styles.footnoteLabelDesktop,
                  isTablet && styles.footnoteLabelTablet
                ]}>Catatan Kaki (Opsional)</Text>
                <TextInput
                  style={[
                    styles.footnoteInput,
                    isMobile && styles.footnoteInputMobile,
                    isDesktop && styles.footnoteInputDesktop,
                    isTablet && styles.footnoteInputTablet
                  ]}
                  placeholder="Tambahkan catatan kaki..."
                  value={footnote}
                  onChangeText={setFootnote}
                  multiline
                  numberOfLines={isDesktop ? 4 : isTablet ? 3 : 2}
                  textAlignVertical="top"
                  returnKeyType="default"
                />
              </View>
            )}

            {/* Tombol Aksi */}
            <View style={[
              styles.actionButtons,
              isMobile && styles.actionButtonsMobile,
              isDesktop && styles.actionButtonsDesktop,
              isTablet && styles.actionButtonsTablet
            ]}>
              <ThreeDButton
                onPress={handleClose}
                title="Batal"
                icon="times"
                color="#6c757d"
                style={[
                  styles.actionButton,
                  isMobile && styles.actionButtonMobile,
                  isDesktop && styles.actionButtonDesktop,
                  isTablet && styles.actionButtonTablet
                ]}
                small={isMobile}
              />
              <ThreeDButton
                onPress={handleAddTask}
                title="Simpan Catatan"
                icon="check"
                color="#28a745"
                style={[
                  styles.actionButton,
                  isMobile && styles.actionButtonMobile,
                  isDesktop && styles.actionButtonDesktop,
                  isTablet && styles.actionButtonTablet
                ]}
                small={isMobile}
              />
            </View>

            {/* Spacer untuk keyboard */}
            <View style={styles.keyboardSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  // Base Styles
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: isMobile ? '100%' : '85%',
    minHeight: isMobile ? '70%' : '60%',
    overflow: "hidden",
  },
  modalContentDesktop: {
    width: 600,
    maxHeight: '80%',
    minHeight: 'auto',
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 40,
  },
  modalContentTablet: {
    width: '90%',
    maxHeight: '85%',
    minHeight: '70%',
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: isMobile ? 14 : 18,
  },
  modalHeaderDesktop: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  modalHeaderTablet: {
    paddingHorizontal: 25,
    paddingVertical: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modalTitleMobile: {
    fontSize: 16,
  },
  modalTitleDesktop: {
    fontSize: 22,
  },
  modalTitleTablet: {
    fontSize: 20,
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: isMobile ? 16 : 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  modalBodyContentDesktop: {
    padding: 30,
    paddingTop: 25,
    paddingBottom: 35,
  },
  modalBodyContentTablet: {
    padding: 25,
    paddingTop: 20,
    paddingBottom: 30,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputLabelDesktop: {
    fontSize: 16,
    marginBottom: 12,
  },
  inputLabelTablet: {
    fontSize: 15,
    marginBottom: 10,
  },
  input: {
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  inputMobile: {
    fontSize: 14,
    minHeight: 80,
    padding: 12,
  },
  inputDesktop: {
    fontSize: 16,
    minHeight: 150,
    padding: 18,
    borderRadius: 12,
  },
  inputTablet: {
    fontSize: 15,
    minHeight: 120,
    padding: 16,
    borderRadius: 11,
  },
  footnoteToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? 12 : 14,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  footnoteToggleMobile: {
    padding: 10,
  },
  footnoteToggleDesktop: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  footnoteToggleTablet: {
    padding: 14,
    borderRadius: 11,
    marginBottom: 14,
  },
  footnoteToggleActive: {
    backgroundColor: "#e3f2fd",
    borderColor: "#4a90e2",
  },
  footnoteToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  footnoteToggleIcon: {
    marginRight: 8,
  },
  footnoteToggleText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  footnoteToggleTextMobile: {
    fontSize: 12,
  },
  footnoteToggleTextDesktop: {
    fontSize: 15,
  },
  footnoteToggleTextTablet: {
    fontSize: 14,
  },
  footnoteToggleTextActive: {
    color: "#4a90e2",
  },
  footnoteInputContainer: {
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#4a90e2",
    paddingLeft: 12,
  },
  footnoteInputContainerDesktop: {
    marginBottom: 20,
    borderLeftWidth: 4,
    paddingLeft: 16,
  },
  footnoteInputContainerTablet: {
    marginBottom: 18,
    paddingLeft: 14,
  },
  footnoteLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4a90e2",
    marginBottom: 6,
  },
  footnoteLabelDesktop: {
    fontSize: 15,
    marginBottom: 8,
  },
  footnoteLabelTablet: {
    fontSize: 14,
    marginBottom: 7,
  },
  footnoteInput: {
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: "top",
    color: "#666",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  footnoteInputMobile: {
    fontSize: 12,
    minHeight: 60,
    padding: 10,
  },
  footnoteInputDesktop: {
    fontSize: 14,
    minHeight: 100,
    padding: 16,
    borderRadius: 10,
  },
  footnoteInputTablet: {
    fontSize: 13,
    minHeight: 80,
    padding: 14,
    borderRadius: 9,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 8,
  },
  actionButtonsMobile: {
    gap: 8,
  },
  actionButtonsDesktop: {
    gap: 15,
    marginTop: 20,
  },
  actionButtonsTablet: {
    gap: 12,
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
  },
  actionButtonMobile: {
    minHeight: 42,
  },
  actionButtonDesktop: {
    minHeight: 50,
  },
  actionButtonTablet: {
    minHeight: 46,
  },
  keyboardSpacer: {
    height: 20,
  },
});

export default AddTaskModal;