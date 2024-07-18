import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
  useColorScheme,
} from "react-native";
import { Text, View, TextInput, Button } from "./Themed";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [subject, setSubject] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");
  const scheme = useColorScheme();

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
    setSubject("");
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles(scheme).container}>
      <Text style={styles(scheme).title}>Añadir actividad</Text>
      {error ? <Text style={styles(scheme).error}>{error}</Text> : null}
      <Picker
        selectedValue={type}
        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
        style={styles(scheme).picker}
      >
        <Picker.Item label="Tarea" value="Tarea" />
        <Picker.Item label="Prueba" value="Prueba" />
        <Picker.Item label="Apunte" value="Apunte" />
      </Picker>
      <TextInput
        style={styles(scheme).input}
        onChangeText={setName}
        value={name}
        placeholder="Nombre de la actividad"
      />
      <TextInput
        style={styles(scheme).inputLarge}
        onChangeText={setDescription}
        value={description}
        placeholder="Descripción de la actividad"
        multiline={true}
        numberOfLines={4}
      />
      {type !== "Apunte" && (
        <View style={styles(scheme).dateButtonContainer}>
          <Text style={styles(scheme).label}>
            Fecha y Hora {type === "Tarea" ? "de Entrega" : "de Comienzo"}:
          </Text>
          <Button
            onPress={() => setShowDatePicker(true)}
            title={`Seleccionar ${
              type === "Tarea" ? "fecha de entrega" : "fecha de comienzo"
            }`}
          />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>
      )}
      <Picker
        selectedValue={subject}
        onValueChange={setSubject}
        style={styles(scheme).picker}
      >
        <Picker.Item label="Matemáticas" value="Matemáticas" />
        <Picker.Item label="Historia" value="Historia" />
        <Picker.Item label="Ciencias" value="Ciencias" />
      </Picker>
      <Button title="Añadir Actividad" onPress={handleAddAssignment} />
    </ScrollView>
  );
}

const styles = (scheme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      padding: 16,
      backgroundColor: scheme === "dark" ? "#333" : "#fff",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: scheme === "dark" ? "#fff" : "#000",
    },
    input: {
      width: "100%",
      borderColor: scheme === "dark" ? "#ccc" : "gray",
      borderWidth: 1,
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
      backgroundColor: scheme === "dark" ? "#555" : "#fff",
      color: scheme === "dark" ? "#fff" : "#000",
    },
    inputLarge: {
      width: "100%",
      borderColor: scheme === "dark" ? "#ccc" : "gray",
      borderWidth: 1,
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
      backgroundColor: scheme === "dark" ? "#555" : "#fff",
      color: scheme === "dark" ? "#fff" : "#000",
      minHeight: 100, // Más espacio para descripciones largas
    },
    picker: {
      width: "100%",
      marginBottom: 20,
      backgroundColor: scheme === "dark" ? "#555" : "#f0f0f0",
      color: scheme === "dark" ? "#fff" : "#000",
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: scheme === "dark" ? "#fff" : "#000",
    },
    error: {
      color: "red",
      fontSize: 16,
      marginBottom: 10,
      textAlign: "center",
    },
    dateButtonContainer: {
      marginBottom: 20,
    },
    button: {
      width: "100%",
      backgroundColor: "#007BFF",
      color: "#ffffff",
      padding: 10,
      borderRadius: 5,
      textAlign: "center",
      marginBottom: 20,
    },
  });
