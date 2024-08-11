import { Modal, StyleSheet } from "react-native";
import { Text, View, TextInput, TouchableOpacity } from "./Themed";
import { useState } from "react";
import { deleteReminder, updateReminder } from "@/lib/api";
import { ScrollView } from "react-native-gesture-handler";
import { Reminder } from "@/lib/context/remindersContext";

interface ListNotesProps {
  notes: Reminder[];
  onNoteUpdated: () => void;
}

export default function ListNotes({ notes, onNoteUpdated }: ListNotesProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const maxLength = 100;
  const openModal = (note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleEditNotes = async () => {
    const result = await updateReminder(
      "Apunte",
      selectedNote.name,
      selectedNote.description,
      selectedNote.id,
      selectedNote.subject_id
    );
    if (!result) {
      alert("Error al actualizar el apunte");
      return;
    }
    alert("Apunte actualizado correctamente");
    closeModal();
  };

  const handleDeleteNotes = async () => {
    try {
      const result = await deleteReminder(selectedNote.id);
      if (!result) {
        alert("Error al eliminar el apunte");
        return;
      }
      alert("Apunte eliminado correctamente");
      onNoteUpdated();
    } catch (e) {
      alert("Error al eliminar el apunte");
    }
    closeModal();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {notes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.examContainer}
            onPress={() => openModal(note)}
          >
            <Text style={styles.subjectName}>{note.subject_name}</Text>
            <Text style={styles.examName}>Nombre: {note.name}</Text>
            <Text style={styles.examDescription}>
              Descripción: {note.description.slice(0, 60)}...
            </Text>
          </TouchableOpacity>
        ))}

        {selectedNote && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalText}>Edita tus datos</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✖</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalHintText}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) =>
                    setSelectedNote({ ...selectedNote, name: text })
                  }
                  value={selectedNote.name}
                />
                <Text style={styles.modalHintText}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  onChangeText={(text) =>
                    setSelectedNote({ ...selectedNote, description: text })
                  }
                  value={selectedNote.description}
                  multiline={true}
                  maxLength={100}
                  textAlignVertical="top"
                />
                <Text style={styles.counter}>
                  {`${selectedNote.description.length}/${maxLength}`}
                </Text>
                <View style={styles.buttonContainerModal}>
                  <TouchableOpacity
                    onPress={handleEditNotes}
                    style={styles.buttonContainer}
                  >
                    <Text style={[styles.buttonText, { color: "green" }]}>
                      Guardar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteNotes}
                    style={styles.buttonContainer}
                  >
                    <Text style={[styles.buttonText, { color: "red" }]}>
                      Eliminar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  descriptionInput: {
    textAlign: "left",
    minHeight: 100,
  },
  counter: {
    alignSelf: "flex-end",
    color: "gray",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  examContainer: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
    height: 160,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  examName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  examDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateTimeText: {
    fontSize: 16,
    marginLeft: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "transparent",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    borderWidth: 1,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalHeaderText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalHintText: {
    textAlign: "left",
    fontSize: 16,
  },
  closeButton: {
    marginTop: -20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  dateTimeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: 30,
    backgroundColor: "transparent",
  },
  dateTimeInput: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  buttonContainerModal: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
