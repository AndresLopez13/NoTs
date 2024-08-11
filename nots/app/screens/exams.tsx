import { Text, View } from "@/components/Themed";
import { Reminder, useReminders } from "@/lib/context/remindersContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { validateUser } from "@/utils/user-validation";
import ListExams from "@/components/ListExams";

export default function ExamScreen() {
  const { reminders, refreshReminders } = useReminders();
  const [exams, setExams] = useState<Reminder[]>([]);

  // Separar la lógica para actualizar los exámenes
  useEffect(() => {
    const filteredExams: Reminder[] = reminders.filter(
      (reminder) => reminder.type === "Prueba"
    );
    setExams(filteredExams);
  }, [reminders]);

  useEffect(() => {
    refreshReminders();

    const subscription = supabase
      .channel("reminders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
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

    return () => supabase.removeChannel(subscription);
  }, []);

  if (!exams) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View>
      <ListExams exams={exams} onExamUpdated={refreshReminders} />
    </View>
  );
}
