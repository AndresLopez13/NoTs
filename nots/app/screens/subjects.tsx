import 'react-native-url-polyfill/auto';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import AddSubjectForm from '@/components/AddSubjectForm';
import { Subjects, fetchSubjects } from '@/lib/api';
import Colors from '@/constants/Colors';

export default function SubjectScreen() {
  const [subjects, setSubjects] = useState<Subjects>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSubjects().then((data) => {
      setSubjects(data);
    })
  }, []);

  const handleSubmit = async (name: string, nrc: number, classroom: string, days: string[], startTime: string) => {
    const { data, error } = await supabase
      .from("subject")
      .insert({
        name,
        nrc,
        classroom,
        days: days.join(','),
        start_time: startTime,
      })
      .select();

    if (error) {
      console.log(error);
      alert("Error al añadir asignatura");
    } else {
      setSubjects([data[0], ...subjects]);
      setShowModal(false);
      alert("Asignatura añadida");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Text style={styles.addButtonText}>Añadir Nueva Asignatura</Text>
      </TouchableOpacity>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>NRC: {item.nrc}</Text>
            <Text>Aula: {item.classroom}</Text>
            <Text>Días: {item.days}</Text>
            <Text>Hora de inicio: {new Date(item.start_time).toLocaleTimeString()}</Text>
          </View>
        )}
      />
      {showModal && (
        <AddSubjectForm onSubmit={handleSubmit} onClose={() => setShowModal(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    backgroundColor: Colors.light.primaryColor,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});