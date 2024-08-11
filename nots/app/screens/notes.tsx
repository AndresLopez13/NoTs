import "react-native-url-polyfill/auto";
import { Text, View } from "@/components/Themed";
import { Reminder, useReminders } from "@/lib/context/remindersContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { validateUser } from "@/utils/user-validation";
import ListNotes from "@/components/ListNotes";

export default function NotesScreen() {
  const { reminders, refreshReminders } = useReminders();
  const [notes, setNotes] = useState<Reminder[]>([]);

  useEffect(() => {
    const filteredNotes = reminders.filter(
      (reminder) => reminder.type === "Apunte"
    );
    setNotes(filteredNotes);
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

  if (!notes) {
    return <Text>Cargando...</Text>;
  }
  return (
    <View>
      <ListNotes notes={notes} onNoteUpdated={refreshReminders} />
    </View>
  );
}
