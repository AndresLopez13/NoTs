import { Alert, Modal, StyleSheet } from "react-native";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useThemeColor,
} from "./Themed";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { deleteReminder, updateReminder } from "@/lib/api";
import { ScrollView } from "react-native-gesture-handler";
import { Reminder } from "@/lib/context/remindersContext";

interface ListExamsProps {
  exams: Reminder[];
  onExamUpdated: () => void;
}

export default function ListExams({ exams, onExamUpdated }: ListExamsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const iconColor = useThemeColor(
    { light: "#4a4a4a", dark: "#dfdfdf" },
    "text"
  );

  const maxLength = 100;
  console.log(exams);

  const openModal = (exam) => {
    setSelectedExam(exam);
    setDate(new Date(exam.date.replace(/\//g, "-") + "T00:00:00"));
    setTime(new Date(`1970-01-01T${exam.time}:00`));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setSelectedExam({
      ...selectedExam,
      date: currentDate.toISOString().split("T")[0],
    });
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    setSelectedExam({
      ...selectedExam,
      time: formatTime(currentTime),
    });
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleEditExam = async () => {
    const result = await updateReminder(
      "Prueba",
      selectedExam.name,
      selectedExam.description,
      selectedExam.id,
      selectedExam.subject_id,
      selectedExam.date,
      selectedExam.time
    );
    if (!result) {
      Alert.alert("Error al actualizar examen", "Ha ocurrido un error al actualizar el examen");
      return;
    }
    Alert.alert("Examen actualizado", "El examen ha sido actualizado con éxito");
    closeModal();
  };

  const handleDeleteExam = async () => {
    try {
      const result = await deleteReminder(selectedExam.id);
      if (!result) {
        Alert.alert("Error al eliminar examen", "Ha ocurrido un error al eliminar el examen");
      }
      Alert.alert("Examen eliminado", "El examen ha sido eliminado con éxito");
      onExamUpdated();
    } catch (error) {
      Alert.alert("Error al eliminar examen", "Ha ocurrido un error al eliminar el examen");
      console.error("Error deleting exam: ", error);
    }
    closeModal();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {exams.map((exam) => (
          <TouchableOpacity
            key={exam.id}
            style={styles.examContainer}
            onPress={() => openModal(exam)}
          >
            <Text style={styles.subjectName}>{exam.subject_name}</Text>
            <Text style={styles.examName}>Nombre: {exam.name}</Text>
            <Text style={styles.examDescription}>
              Descripción: {exam.description.slice(0, 60)}...
            </Text>
            <View style={styles.dateTimeContainer}>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={iconColor}
              />
              <Text style={styles.dateTimeText}>
                {formatDate(
                  new Date(`${exam.date.replace(/\//g, "-")}T00:00:00`)
                )}
              </Text>
              <MaterialIcons name="access-time" size={24} color={iconColor} />
              <Text style={styles.dateTimeText}>{exam.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {selectedExam && (
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
                    setSelectedExam({ ...selectedExam, name: text })
                  }
                  value={selectedExam.name}
                />
                <Text style={styles.modalHintText}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  onChangeText={(text) =>
                    setSelectedExam({ ...selectedExam, description: text })
                  }
                  value={selectedExam.description}
                  multiline={true}
                  maxLength={100}
                  textAlignVertical="top"
                />
                <Text style={styles.counter}>
                  {`${selectedExam.description.length}/${maxLength}`}
                </Text>
                <Text style={styles.modalHintText}>Fecha y Hora</Text>
                <View style={styles.dateTimeInputContainer}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={24}
                    color={iconColor}
                  />
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="calendar"
                      onChange={onDateChange}
                    />
                  )}
                  <MaterialIcons
                    name="access-time"
                    size={24}
                    color={iconColor}
                  />
                  <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={time}
                      mode="time"
                      display="spinner"
                      onChange={onTimeChange}
                    />
                  )}
                </View>
                <View style={styles.buttonContainerModal}>
                  <TouchableOpacity
                    onPress={handleEditExam}
                    style={styles.buttonContainer}
                  >
                    <Text style={[styles.buttonText, { color: "green" }]}>
                      Guardar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteExam}
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
