import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../supabase";

export interface Reminder {
  id: string | null;
  name: string | null;
  description: string | null;
  date: string | null;
  time: string | null;
  subject_name: string | null;
  subject_id: string | null;
  user_id: string | null;
  type: string | null;
}

interface ReminderContextType {
  reminders: Reminder[];
  refreshReminders: () => Promise<void>;
}

const ReminderContext = createContext<ReminderContextType>({
  reminders: [],
  refreshReminders: async () => {},
});

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const refreshReminders = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { data: reminders, error } = await supabase
        .from("reminders_with_subjects")
        .select("*")
        .eq("user_id", data.session.user.id);

      if (error) {
        console.error("Error fetching reminders in Supabase:", error);
      } else {
        setReminders(reminders);
      }
    }
  }, []);

  useEffect(() => {
    refreshReminders();
  }, [refreshReminders]);

  return (
    <ReminderContext.Provider value={{ reminders, refreshReminders }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => useContext(ReminderContext);
