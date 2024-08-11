import "react-native-url-polyfill/auto";
import { Text, View } from "@/components/Themed";
import { Reminder, useReminders } from "@/lib/context/remindersContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { validateUser } from "@/utils/user-validation";
import ListAssignments from "@/components/ListAssignments";

export default function AssignmentScreen() {
  const { reminders, refreshReminders } = useReminders();
  const [assignments, setAssignments] = useState<Reminder[]>([]);

  useEffect(() => {
    const filteredAssigments: Reminder[] = reminders.filter(
      (reminder) => reminder.type === "Tarea"
    );
    setAssignments(filteredAssigments);
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

  if (!assignments) {
    return <Text>Cargando...</Text>;
  }
  return (
    <View>
      <ListAssignments
        assignments={assignments}
        onAssigmentUpdated={refreshReminders}
      />
    </View>
  );
}
