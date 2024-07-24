import { Database } from "@/db_types";
import { supabase } from "./supabase";
import { Subject } from "../types/Schedule";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

export const fetchSubjects = async () => {
  const { data } = await supabase.auth.getSession();
  const { data: subjects, error } = await supabase
    .from("subject")
    .select("*")
    .eq("user_id", data.session?.user.id!)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  } else {
    return subjects;
  }
};

export async function fetchSubjectsByUserId(
  userId: string
): Promise<Subject[]> {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const { data, error } = await supabase
    .from("subject")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data as unknown as Subject[];
}

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

export async function updateSubject(subjectId: string, updatedData: Partial<Subject>) {
  const { data: currentSubject, error: fetchError } = await supabase
    .from('subject')
    .select('schedule')
    .eq('id', subjectId)
    .single();

  if (fetchError) {
    console.error('Error fetching subject:', fetchError);
    throw fetchError;
  }

  let newSchedule = currentSubject?.schedule || [];
  if (updatedData.schedule && updatedData.schedule.length > 0) {
    const updatedDay = updatedData.schedule[0].day;
    const existingDayIndex = newSchedule.findIndex((s: any) => s.day === updatedDay);
    if (existingDayIndex !== -1) {
      newSchedule[existingDayIndex] = updatedData.schedule[0];
    } else {
      newSchedule.push(updatedData.schedule[0]);
    }
  }

  const { data, error } = await supabase
    .from('subject')
    .update({
      ...updatedData,
      schedule: newSchedule
    })
    .eq('id', subjectId);

  if (error) {
    console.error('Error updating subject:', error);
    throw error;
  }

  return data;
}

export async function deleteSubject(subjectId: string) {
  const { data, error } = await supabase
    .from('subject')
    .delete()
    .eq('id', subjectId);

  if (error) {
    throw error;
  }

  return data;
}

export type Subjects = Awaited<ReturnType<typeof fetchSubjects>>;
export type Reminders = Awaited<ReturnType<typeof fetchReminders>>;
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
