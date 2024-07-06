import { StyleSheet, TextInput, Button, Platform } from 'react-native';
import { Text, View } from './Themed';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';

interface Props {
  onSubmit: (title: string, description: string, due_date: Date) => void;
}

export default function AddAssignmentForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;

  const handleAddAssignment = () => {
    if (!title || !description) {
      let errorMessage = '';
      if (!title && !description) {
        errorMessage = 'Todos los campos son obligatorios';
      } else if (!title) {
        errorMessage = 'El título es obligatorio';
      } else if (!description) {
        errorMessage = 'La descripción es obligatoria';
      }
      setError(errorMessage);
      return;
    }

    setError('');
    onSubmit(title, description, dueDate);
    setTitle('');
    setDescription('');
    setDueDate(new Date());
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir tarea</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={[styles.input, { color: textColor }]}
        onChangeText={setTitle}
        value={title}
        placeholder="Titulo de la tarea"
        placeholderTextColor={'#666'}
        selectionColor={'#666'}
      />
      <TextInput
        style={[styles.input, { color: textColor }]}
        onChangeText={setDescription}
        value={description}
        placeholder="Descripción de la tarea"
        placeholderTextColor={'#666'}
      />
      <View>
        <Text>Fecha de vencimiento: {formatDate(dueDate)}</Text>
        <Button onPress={() => setShowDatePicker(true)} title="Seleccionar fecha de vencimiento" />
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dueDate}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      <View style={styles.separator} />
      <Button
        title="Añadir Tarea"
        onPress={handleAddAssignment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    paddingBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    color: '#fff',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
