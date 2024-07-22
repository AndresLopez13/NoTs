import { Exam } from "@/types/Reminder";
import { Modal, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Text, View, Button } from "./Themed";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

export default function ListExams({ exams }: Exam) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const openModal = (exam) => {
    setSelectedExam(exam);
    setDate(new Date()); // Assumimos que 'exam.date' está em um formato válido
    setTime(new Date()); // Assumimos que 'exam.time' está em um formato válido
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setSelectedExam({ ...selectedExam, date: currentDate.toISOString() });
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    setSelectedExam({ ...selectedExam, time: currentTime.toTimeString() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exámenes</Text>
      {exams.map((exam) => (
        <View
          key={exam.id}
          style={styles.examContainer}
          onTouchEnd={() => openModal(exam)}
        >
          <Text style={styles.subjectName}>{exam.subject_name}</Text>
          <Text style={styles.examName}>Nombre: {exam.name}</Text>
          <Text style={styles.examDescription}>
            Descripción: {exam.description.slice(0, 60)}...
          </Text>
          <View style={styles.dateTimeContainer}>
            <MaterialCommunityIcons name="calendar" size={24} color="#333" />
            <Text style={styles.dateTimeText}>{exam.date}</Text>
            <MaterialIcons name="access-time" size={24} color="#333" />
            <Text style={styles.dateTimeText}>{exam.time}</Text>
          </View>
        </View>
      ))}

      {selectedExam && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Editar Examen</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setSelectedExam({ ...selectedExam, name: text })
                }
                value={selectedExam.name}
              />
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                onChangeText={(text) =>
                  setSelectedExam({ ...selectedExam, description: text })
                }
                value={selectedExam.description}
                multiline
              />
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="calendar"
                  onChange={onDateChange}
                />
              )}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.pickerButton}
              >
                <MaterialIcons name="calendar-today" size={24} color="#333" />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="clock"
                  onChange={onTimeChange}
                />
              )}
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={styles.pickerButton}
              >
                <MaterialIcons name="access-time" size={24} color="#333" />
              </TouchableOpacity>
              <Button title="Guardar Cambios" onPress={closeModal} />
              <Button title="Cerrar" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 300,
    marginBottom: 10,
  },
  descriptionInput: {
    minHeight: 100, // Aumentar altura para descripciones más largas
  },
  pickerButton: {
    marginBottom: 10,
  },
});
