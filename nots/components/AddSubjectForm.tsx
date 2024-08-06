import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Text, View, TextInput, Button } from "./Themed";
import DateTimePicker, {
  EvtTypes,
} from "@react-native-community/datetimepicker";
import * as Notifications from 'expo-notifications';
import { scheduleNotification } from '../utils/notification'; 

interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Props {
  onSubmit: (
    name: string,
    nrc: number,
    classroom: string,
    schedule: DaySchedule[],
    notification_ids: string[]
  ) => void;
  onClose: () => void;
}

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function AddSubjectForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [nrc, setNrc] = useState("");
  const [classroom, setClassroom] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      console.log(`Estado actual de permisos de notificación: ${status}`);
      if (status !== 'granted') {
        console.log('Solicitando permisos de notificación...');
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        console.log(`Nuevo estado de permisos: ${newStatus}`);
      }
    })();
  }, []);

  const handleOpenModal = (day: string) => {
    setErrorModal("");
    const existingDay = schedule.find((d) => d.day === day);
    if (existingDay) {
      setStartTime(new Date(`2021-01-01T${existingDay.startTime}:00`));
      setEndTime(new Date(`2021-01-01T${existingDay.endTime}:00`));
    } else {
      setStartTime(new Date());
      setEndTime(new Date());
    }
    setSelectedDay(day);
    setModalVisible(true);
  };

  const handleTimeChange = (
    event: {
      type: EvtTypes;
      nativeEvent: { timestamp: number; utcOffset: number };
    },
    selectedDate: Date | undefined,
    type: string
  ) => {
    const currentDate =
      selectedDate || (type === "start" ? startTime : endTime);
    if (type === "start") {
      setStartTime(currentDate);
      setShowStartTimePicker(false);
    } else {
      setEndTime(currentDate);
      setShowEndTimePicker(false);
    }
  };

  const handleSaveSchedule = () => {
    const formattedStartTime = startTime.toTimeString().substring(0, 5);
    const formattedEndTime = endTime.toTimeString().substring(0, 5);

    const startDateTime = new Date(`1970-01-01T${formattedStartTime}:00`);
    const endDateTime = new Date(`1970-01-01T${formattedEndTime}:00`);

    if (startDateTime > endDateTime) {
      setErrorModal("La hora de inicio debe ser menor que la hora de fin.");
      return;
    }
    if (startDateTime.getTime() === endDateTime.getTime()) {
      setErrorModal("La horas no pueden ser iguales.");
      return;
    }

    setErrorModal("");
    setSchedule(
      schedule
        .filter((item) => item.day !== selectedDay)
        .concat([
          {
            day: selectedDay,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          },
        ])
    );
    setModalVisible(false);
  };

  const handleDeleteSchedule = () => {
    setSchedule(schedule.filter((item) => item.day !== selectedDay));
    setModalVisible(false);
  };

  const handleAddSubject = async () => {

    if (!name || !nrc || !classroom || schedule.length === 0) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");

    try {
      const notificationsIds = await scheduleNotification(name, classroom, schedule);

      onSubmit(name, parseInt(nrc), classroom, schedule, notificationsIds);
    } catch (error) {
      console.error("Error al programar notificaciones:", error);
      setError("Hubo un problema al programar las notificaciones");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Datos de la asignatura</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Nombre de la asignatura"
      />
      <View style={styles.rowContainer}>
        <TextInput
          style={styles.halfInput}
          onChangeText={setNrc}
          value={nrc}
          placeholder="NRC"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.halfInput}
          onChangeText={setClassroom}
          value={classroom}
          placeholder="Aula"
        />
      </View>

      <Text style={styles.subtitle}>Escoge los días de la semana</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={
              schedule.some((s) => s.day === day)
                ? styles.dayButtonSelected
                : styles.dayButton
            }
            onPress={() => handleOpenModal(day)}
          >
            <Text
              style={
                schedule.some((s) => s.day === day)
                  ? styles.dayTextSelected
                  : null
              }
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalText}>Escoge tu horario</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✖</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Hora de inicio:</Text>
              <TouchableOpacity
                style={styles.timeValue}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text>{startTime.toTimeString().substring(0, 5)}</Text>
              </TouchableOpacity>
            </View>
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
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>Hora de fin:</Text>
              <TouchableOpacity
                style={styles.timeValue}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text>{endTime.toTimeString().substring(0, 5)}</Text>
              </TouchableOpacity>
            </View>
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
            <View style={styles.buttonContainerModal}>
              <Button
                color="red"
                title="Eliminar Horario"
                onPress={handleDeleteSchedule}
              />
              <View style={styles.space} />
              <Button title="Guardar Horario" onPress={handleSaveSchedule} />
              {errorModal ? (
                <Text style={styles.errorText}>{errorModal}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <Button title="Crear materia" onPress={handleAddSubject} />
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
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 16,
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
    borderColor: "gray",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingBottom: 30,
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
    alignItems: "center",
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
    width: "80%",
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
  closeButton: {
    marginTop: -20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeValue: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 100,
    alignItems: "center",
    borderColor: "gray",
  },
  buttonContainerModal: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  space: {
    height: 10,
  },
});
