import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, TextInput, useThemeColor } from "./Themed";
import DateTimePicker, { EvtTypes } from "@react-native-community/datetimepicker";
import { ScheduleItem } from "../types/Schedule";
import { MaterialIcons } from "@expo/vector-icons";
import { updateSubject } from "@/lib/api";

interface Props {
  item: ScheduleItem;
  onSubmit: (updatedItem: ScheduleItem) => void;
  onDelete: (itemId: string) => void;
  onClose: () => void;
}

export default function EditSubjectForm({ item, onSubmit, onDelete, onClose }: Props) {
  const [subject, setSubject] = useState(item.subject);
  const [nrc, setNrc] = useState(item.nrc.toString());
  const [classroom, setClassroom] = useState(item.classroom);
  const [startTime, setStartTime] = useState(new Date(`2021-01-01T${item.startTime}:00`));
  const [endTime, setEndTime] = useState(new Date(`2021-01-01T${item.endTime}:00`));
  const [selectedDay] = useState(item.day);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [error, setError] = useState("");
  const iconColor = useThemeColor({ light: '#4a4a4a', dark: '#dfdfdf' }, 'text');

  const handleTimeChange = (
    event: {
      type: EvtTypes;
      nativeEvent: { timestamp: number; utcOffset: number };
    },
    selectedDate: Date | undefined,
    type: string
  ) => {
    const currentDate = selectedDate || (type === "start" ? startTime : endTime);
    if (type === "start") {
      setStartTime(currentDate);
      setShowStartTimePicker(false);
    } else {
      setEndTime(currentDate);
      setShowEndTimePicker(false);
    }
  };

  const handleUpdateSubject = async () => {
    if (!subject || !nrc || !classroom) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const formattedStartTime = startTime.toTimeString().substring(0, 5);
    const formattedEndTime = endTime.toTimeString().substring(0, 5);
    const startDateTime = new Date(`1970-01-01T${formattedStartTime}:00`);
    const endDateTime = new Date(`1970-01-01T${formattedEndTime}:00`);

    if (startDateTime >= endDateTime) {
      setError("La hora de inicio debe ser menor que la hora de fin.");
      return;
    }

    setError("");
    const updatedItem: ScheduleItem = {
      ...item,
      subject,
      nrc: parseInt(nrc),
      classroom,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    try {
      await updateSubject(item.subjectId, {
        name: subject,
        nrc: parseInt(nrc),
        classroom,
        schedule: [{
          day: selectedDay,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        }]
      });

      onSubmit(updatedItem);
    } catch (error) {
      console.error('Error al actualizar la asignatura:', error);
      setError("Hubo un error al actualizar. Por favor, intenta de nuevo.");
    }
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.modalHeaderText}>
          <Text style={styles.modalText}>Editar asignatura</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.modalHintText}>Nombre de la asignatura:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setSubject}
          value={subject}
        />
        <View style={styles.rowContainer} >
          <Text style={styles.modalHintText}>NRC: </Text>
          <TextInput
            style={styles.halfInput}
            onChangeText={setNrc}
            value={nrc}
            keyboardType="numeric"
          />
          <Text style={styles.modalHintText}>Aula: </Text>
          <TextInput
            style={styles.halfInput}
            onChangeText={setClassroom}
            value={classroom}
          />
        </View>

        <Text style={styles.modalHintText}>Horario Día {selectedDay}</Text>
        <View style={styles.dateTimeInputContainer}>
          <MaterialIcons name="access-time" size={24} color={iconColor} />
          <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
            <Text style={styles.dateTimeText}>
              {startTime.toTimeString().substring(0, 5)}
            </Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="spinner"
              onChange={(event, selectedDate) =>
                handleTimeChange(event, selectedDate, "start")
              }
            />
          )}
          <Text> - </Text>
          <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
            <Text style={styles.dateTimeText}>
              {endTime.toTimeString().substring(0, 5)}
            </Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="spinner"
              onChange={(event, selectedDate) =>
                handleTimeChange(event, selectedDate, "end")
              }
            />
          )}
        </View>

        <View style={styles.buttonContainerModal}>
          <TouchableOpacity onPress={handleUpdateSubject} style={styles.buttonContainer}>
            <Text style={[styles.buttonText, { color: "green" }]}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.subjectId)} style={styles.buttonContainer}>
            <Text style={[styles.buttonText, { color: "red" }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignContent: "center",
    justifyContent: "center",
  },
  error: { color: "red", marginBottom: 10 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  halfInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    flex: 1,
    marginVertical: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "gray",
    width: "30%",
    alignItems: "center",
    margin: 2,
  },
  dayButtonSelected: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#0c9bbd",
    backgroundColor: "#ffce06",
    width: "30%",
    alignItems: "center",
    margin: 2,
  },
  dayTextSelected: { color: "black" },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
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
  dateTimeText: {
    fontSize: 16,
    marginLeft: 4,
  },
  buttonContainerModal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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