import 'react-native-url-polyfill/auto';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import AddAssignmentForm from '@/components/AddAssignmentForm';
import { Assignments, fetchAssignments } from '@/lib/api';

export default function TabOneScreen() {
  const [assignments, setAssignments] = useState<Assignments>([]);

  useEffect(() => {
    fetchAssignments().then((data) => {
      setAssignments(data);
    })
  }, []);

  const handleSubmit = async (title: string, description: string, due_date: Date) => {
    const { data, error } = await supabase.from("assignments").insert({ title, description, due_date: due_date.toISOString() }).select();
    if (error) {
      console.log(error);
      alert("Error al añadir tarea");
    } else {
      setAssignments([data[0], ...assignments]);
      alert("Tarea añadida");
    }
  };

  return (
    <View style={styles.container}>
      <AddAssignmentForm onSubmit={handleSubmit} />
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
