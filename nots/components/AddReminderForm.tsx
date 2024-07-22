import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text, View, TextInput, Button } from "./Themed";
import DateTimePicker, {
  EvtTypes,
} from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "../lib/supabase";

interface Props {
  onSubmit: (
    type: string,
    name: string,
    description: string,
    date?: string,
    time?: string,
    subject_id?: string
  ) => void;
}

export default function AddAssignmentForm({ onSubmit }: Props) {
  const [type, setType] = useState("Tarea");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubjects().then((subjects) => {
      if (subjects.length > 0) {
        setSelectedSubject(subjects[0].id);
      }
    });
  }, []);

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

  const handleConfirmDate = (
    event: {
      type: EvtTypes;
      nativeEvent: { timestamp: number; utcOffset: number };
    },
    selectedDate: Date | undefined
  ) => {
    setDate(selectedDate as Date);
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

  const fetchSubjects = async () => {
    const { data } = await supabase.auth.getSession();
    const { data: subjects, error } = await supabase
      .from("subject")
      .select("id, name")
      .eq("user_id", data.session?.user.id!)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return [];
    }
    setSubjects(subjects);
    return subjects;
  };

  const handleAddAssignment = () => {
    const formattedTime = time.toTimeString().substring(0, 5);
    //Dejar la fecha asi 2024-07-19
    const formattedDate = date.toISOString().substring(0, 10);
    if (!name || !description) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError("");
    onSubmit(
      type,
      name,
      description,
      formattedDate,
      formattedTime,
      selectedSubject
    );
    setName("");
    setDescription("");
    setDate(new Date());
    setTime(new Date());
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.subtitle}>Tipo de actividad</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={setType}
          style={styles.pickerItem}
        >
          <Picker.Item label="Tarea" value="Tarea" style={styles.pickerText} />
          <Picker.Item
            label="Prueba"
            value="Prueba"
            style={styles.pickerText}
          />
          <Picker.Item
            label="Apunte"
            value="Apunte"
            style={styles.pickerText}
          />
        </Picker>
      </View>
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
        multiline
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
                <Icon name="calendar" size={24} color="#9ca3af" />
              </TouchableOpacity>
              <Text style={styles.label}>{formatDate(date)}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.label}>Hora</Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={showTimePicker}
              >
                <Icon name="clock-o" size={24} color="#9ca3af" />
              </TouchableOpacity>
              <Text style={styles.label}>{formatTime(time)}</Text>
            </View>
            {isDatePickerVisible && (
              <DateTimePicker
                mode="date"
                onChange={(event, selectedDate) =>
                  handleConfirmDate(event, selectedDate)
                }
                display="spinner"
                value={date}
              />
            )}
            {isTimePickerVisible && (
              <DateTimePicker
                mode="time"
                display="spinner"
                onChange={(event, selectedTime) =>
                  handleConfirmTime(selectedTime)
                }
                value={time}
              />
            )}
          </View>
        </View>
      )}
      <Text style={styles.subtitle}>Materia</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={setSelectedSubject}
          style={styles.pickerItem}
        >
          {subjects.map((subject, index) => (
            <Picker.Item
              key={index}
              label={subject.name}
              value={subject.id}
              style={styles.pickerText}
            />
          ))}
        </Picker>
      </View>
      <Button title="Añadir Actividad" onPress={handleAddAssignment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
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
    backgroundColor: "transparent",
  },
  inputLarge: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "transparent",
    minHeight: 100,
  },
  pickerContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerItem: {
    width: "100%",
  },
  pickerText: {
    color: "#9ca3af",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#9ca3af",
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
    marginRight: 5,
    backgroundColor: "transparent",
  },
  timeContainer: {
    flex: 1,
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginLeft: 5,
    backgroundColor: "transparent",
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
