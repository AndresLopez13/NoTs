import "react-native-url-polyfill/auto";
import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { supabase } from "../../lib/supabase";
import AddReminderForm from "@/components/AddReminderForm";

export default function ReminderScreen() {
  const handleSubmit = async (
    type: string,
    name: string,
    description: string,
    date?: string,
    time?: string,
    selectedSubject?: string
  ) => {
    const { data } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("reminders")
      .insert({
        type,
        name,
        description,
        date,
        time,
        subject_id: selectedSubject,
        user_id: data.session?.user.id!,
      })
      .select();
    if (error) {
      console.log(error);
      alert("Error al añadir el recordatorio");
    } else {
      alert("Recordatorio creado");
    }
  };

  return (
    <View style={styles.container}>
      <AddReminderForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
