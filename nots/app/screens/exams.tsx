import { Text, View } from "@/components/Themed";
import ListExams from "@/components/ListExams";
import { useReminders } from "@/lib/context/remindersContext";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { validateUser } from "@/utils/user-validation";

export default function ExamScreen() {
  const { reminders, refreshReminders } = useReminders();
  const exams = reminders.filter((reminder) => reminder.type === "Prueba");

  useEffect(() => {
    supabase
      .channel("reminders_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reminders",
        },
        async (payload) => {
          if (await validateUser(payload)) {
            refreshReminders();
          }
        }
      )
      .subscribe();
  }, []);

  if (!exams) {
    return <Text>Cargando...</Text>;
  }
  return (
    <View>
      <ListExams exams={exams} />
    </View>
  );
}
