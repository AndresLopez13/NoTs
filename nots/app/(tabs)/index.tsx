import 'react-native-url-polyfill/auto';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import AddAssignmentForm from '@/components/AddAssignmentForm';

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
}

export default function TabOneScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data, error } = await supabase.from<Assignment>("assignments").select("*").order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setAssignments(data ?? []);
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmit = async (title: string, description: string, due_date: Date) => {
    const { data, error } = await supabase.from("assignments").insert([{ title, description, due_date }]).select();
    if (error) {
      console.log(error);
      alert("Error al añadir tarea");
    } else {
      // Actualizar la lista de asignaciones
      setAssignments([data[0], ...assignments]);
      alert("Tarea añadida");
    }
  };

  return (
    <View style={styles.container}>
      <AddAssignmentForm onSubmit={handleSubmit} />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{new Date(item.due_date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
