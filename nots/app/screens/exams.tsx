import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useUserInfo } from "@/lib/userContext";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { supabase } from "@/lib/supabase";
import ListExams from "@/components/ListExams";
import { Exam } from "@/types/Reminder";

export default function ExamScreen() {
  const { session } = useUserInfo();
  const { data, error } = useQuery(
    supabase
      .from("reminders_with_subjects")
      .select("*")
      .eq("user_id", session!.user.id)
      .eq("type", "Prueba"),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  console.log(data);
  if (!data) {
    return <Text>Cargando...</Text>;
  }
  return (
    <View>
      <ListExams exams={data} />
    </View>
  );
}

const styles = StyleSheet.create({});
