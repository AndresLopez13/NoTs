import { Exam } from "@/types/Reminder";
import { Modal, StyleSheet } from "react-native";
import { Text, View, TextInput, TouchableOpacity } from "./Themed";
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
    setDate(new Date(`${exam.date.replace(/\//g, "-")}T00:00:00`));
    setTime(new Date(`2021-01-01T${exam.time}:00`));
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
      time: currentTime.toISOString().split("T")[1].substring(0, 5),
    });
  };
  const maxLength = 100;

  return (
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
            <MaterialCommunityIcons name="calendar" size={24} color="#333" />
            <Text style={styles.dateTimeText}>{exam.date}</Text>
            <MaterialIcons name="access-time" size={24} color="#333" />
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
                  color="#333"
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateTimeText}>
                    {date.toISOString().split("T")[0]}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="calendar"
                    onChange={onDateChange}
                  />
                )}
                <MaterialIcons name="access-time" size={24} color="#333" />
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.dateTimeText}>
                    {time.toISOString().split("T")[1].substring(0, 5)}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="clock"
                    onChange={onTimeChange}
                  />
                )}
              </View>
              <View style={styles.buttonContainerModal}>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.buttonContainer}
                >
                  <Text style={[styles.buttonText, { color: "green" }]}>
                    Guardar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeModal}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  descriptionInput: {
    textAlign: "left",
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
  descriptionInput: {
    minHeight: 100,
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
