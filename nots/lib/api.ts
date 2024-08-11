import { Database } from "@/db_types";
import { supabase } from "./supabase";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

export const fetchReminders = async () => {
  const { data } = await supabase.auth.getSession();
  try {
    const { data: reminders, error } = useQuery(
      supabase
        .from("reminders")
        .select("*")
        .eq("user_id", data.session?.user.id!),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );
    if (error) {
      console.log(error);
      return [];
    } else {
      console.log(reminders);
      return reminders;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateReminder = async (
  type: string,
  name: string,
  description: string,
  reminder_id: string,
  subject_id: string,
  date?: string,
  time?: string
) => {
  if (!date || !time) {
    const { error } = await supabase
      .from("reminders")
      .update({
        type,
        name,
        description,
        subject_id,
      })
      .eq("id", reminder_id);
    if (error) {
      console.log(reminder_id);
      console.log(error.message);
      return false;
    }
    return true;
  }

  const { error } = await supabase
    .from("reminders")
    .update({
      type,
      name,
      description,
      date,
      time,
      subject_id,
    })
    .eq("id", reminder_id!);
  if (error) {
    console.log(error);
    return false;
  }
  return true;
};

export const deleteReminder = async (reminder_id: string) => {
  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminder_id);
  if (error) {
    return false;
  }
  return true;
};

export const downloadAvatar = async (path: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) throw error;
    const fr = new FileReader();
    fr.readAsDataURL(data);
    return new Promise((resolve) => {
      fr.onload = () => {
        resolve(fr.result as string);
      };
    });
  } catch (err) {
    console.log("error", err);
    return "";
  }
};

export type Reminders = Awaited<ReturnType<typeof fetchReminders>>;
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
