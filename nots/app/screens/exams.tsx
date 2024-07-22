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
    supabase.from("reminders").select("*").eq("user_id", session!.user.id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  let exam: Exam = { exams: data };
  return (
    <View>
      <ListExams exams={data} />
    </View>
  );
}

const styles = StyleSheet.create({});
