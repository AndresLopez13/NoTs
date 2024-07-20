import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome"; // Asegúrate de instalar esta librería

interface Props {
  onSubmit: (
    type: string,
    name: string,
    description: string,
    date?: Date,
    subject?: string
  ) => void;
}

export default function AddAssignmentForm({ onSubmit }: Props) {
  const [type, setType] = useState("Tarea");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [subject, setSubject] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [error, setError] = useState("");

  const handleAddAssignment = () => {
    if (!name || !description || (!date && type !== "Apunte") || !subject) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError("");
    onSubmit(type, name, description, date, subject);
    setName("");
    setDescription("");
    setDate(new Date());
    setTime(new Date());
    setSubject("");
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleConfirmTime = (selectedTime) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = (time) => {
    return `${time.getHours()}:${time.getMinutes()}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Añadir actividad</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Picker
        selectedValue={type}
        onValueChange={setType}
        style={styles.picker}
      >
        <Picker.Item label="Tarea" value="Tarea" />
        <Picker.Item label="Prueba" value="Prueba" />
        <Picker.Item label="Apunte" value="Apunte" />
      </Picker>
      <Text style={styles.subtitle}>Datos de la actividad</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Nombre de la actividad"
      />
      <TextInput
        style={styles.inputLarge}
        onChangeText={setDescription}
        value={description}
        placeholder="Descripción de la actividad"
        multiline={true}
        numberOfLines={4}
      />
      {type !== "Apunte" && (
        <View style={styles.dateButtonContainer}>
          <Text style={styles.subtitle}>Datos de la entrega</Text>
          <View style={styles.dateHourContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Fecha</Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={showDatePicker}
              >
                <Icon name="calendar" size={24} color="#000" />
              </TouchableOpacity>
              <Text>{formatDate(date)}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.label}>Hora</Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={showTimePicker}
              >
                <Icon name="clock-o" size={24} color="#000" />
              </TouchableOpacity>
              <Text>{formatTime(time)}</Text>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
              date={date}
            />
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmTime}
              onCancel={hideTimePicker}
              date={time}
            />
          </View>
        </View>
      )}
      <Text style={styles.subtitle}>Materia</Text>
      <Picker
        selectedValue={subject}
        onValueChange={setSubject}
        style={styles.picker}
      >
        <Picker.Item label="Matemáticas" value="Matemáticas" />
        <Picker.Item label="Historia" value="Historia" />
        <Picker.Item label="Ciencias" value="Ciencias" />
      </Picker>
      <Button title="Añadir Actividad" onPress={handleAddAssignment} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
    color: "#000",
  },
  inputLarge: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
    color: "#000",
    minHeight: 100,
  },
  picker: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    color: "#000",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  dateHourContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 5, // Espacio a la derecha del contenedor de la fecha
  },
  timeContainer: {
    flex: 1,
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginLeft: 5, // Espacio a la izquierda del contenedor de la hora
  },
  dateButtonContainer: {
    marginBottom: 20,
  },
  iconButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
  },
});
