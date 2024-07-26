import "react-native-url-polyfill/auto";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { supabase } from "../../lib/supabase";
import AddSubjectForm from "@/components/AddSubjectForm";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";

interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export default function SubjectScreen() {
  const navigation = useNavigation();

  const handleSubmit = async (
    name: string,
    nrc: number,
    classroom: string,
    schedule: DaySchedule[]
  ) => {
    const { data } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("subject")
      .insert({
        name,
        nrc,
        classroom,
        user_id: data.session?.user.id!,
        schedule,
      })
      .select();

    if (error) {
      console.log(error);
      Alert.alert("Error", "Error al añadir asignatura");
    } else {
      Alert.alert("Éxito", "Asignatura creada correctamente");
      navigation.navigate("screens/schedule");
    }
  };

  return (
    <View style={styles.container}>
      <AddSubjectForm onSubmit={handleSubmit} />
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
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
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
