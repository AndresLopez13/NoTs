import { createContext, useState, useContext, ReactNode } from "react";
import { supabase } from "../supabase";

const ReminderContext = createContext({});

export const useReminders = () => useContext(ReminderContext);

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState([]);

  const refreshExams = async () => {
    try {
      const { data, error } = await supabase.from("reminders").select("*");
      if (error) throw error;
      setReminders(data);
    } catch (error) {
      console.error("Error fetching reminders: ", error.message);
    }
  };

  return (
    <ReminderContext.Provider value={{ reminders, refreshExams }}>
      {children}
    </ReminderContext.Provider>
  );
};
