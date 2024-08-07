import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../supabase";
import { useUserInfo } from "./userContext";

export interface Reminder {
  id: string | null;
  name: string | null;
  description: string | null;
  date: string | null;
  time: string | null;
  subject_name: string | null;
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

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  try {
    useEffect(() => {
      refreshReminders();
    }, []);

    const refreshReminders = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: reminders, error } = await supabase
          .from("reminders_with_subjects")
          .select("*")
          .eq("user_id", data.session?.user.id!);

        if (error) {
          console.error("Error fetching reminders in Supabase:", error);
        } else {
          setReminders(reminders);
        }
      }
    };

    return (
      <ReminderContext.Provider value={{ reminders, refreshReminders }}>
        {children}
      </ReminderContext.Provider>
    );
  } catch (error) {
    console.error("Error fetching reminders:", error);
  }
}

export function useReminders() {
  return useContext(ReminderContext);
}
