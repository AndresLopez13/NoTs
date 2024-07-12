import React, { useState } from 'react';
import { StyleSheet, Platform, ScrollView, Switch } from 'react-native';
import { Text, View, TextInput, Button } from './Themed';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface Props {
  onSubmit: (name: string, nrc: number, classroom: string, days: string[], startTime: string) => void;
  onClose: () => void;
}

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function AddSubjectForm({ onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const [nrc, setNrc] = useState('');
  const [classroom, setClassroom] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState('');

  const handleAddSubject = () => {
    if (!name || !nrc || !classroom || days.length === 0) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError('');
    onSubmit(
      name,
      parseInt(nrc),
      classroom,
      days,
      startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    );
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || startTime;
    setShowTimePicker(Platform.OS === 'ios');
    setStartTime(currentTime);
  };

  const toggleDay = (day: string) => {
    setDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Añadir Asignatura</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Nombre de la asignatura"
      />
      <TextInput
        style={styles.input}
        onChangeText={setNrc}
        value={nrc}
        placeholder="NRC"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setClassroom}
        value={classroom}
        placeholder="Aula"
      />
      <Text style={styles.sectionTitle}>Días de clase:</Text>
      <View style={styles.daysContainer}>
        {daysOfWeek.map(day => (
          <View key={day} style={styles.dayItem}>
            <Text>{day}</Text>
            <Switch
              value={days.includes(day)}
              onValueChange={() => toggleDay(day)}
            />
          </View>
        ))}
      </View>
      <View>
        <Text>Hora de inicio: {startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</Text>
        <Button onPress={() => setShowTimePicker(true)} title="Seleccionar hora de inicio" />
        {showTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Añadir Asignatura"
          onPress={handleAddSubject}
        />
        <Button
          title="Cancelar"
          onPress={onClose}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingBottom: 30,
  },
});