import { Database } from "@/db_types";
import { supabase } from "./supabase";
import { Subject } from "./scheduleUtils";

export const fetchAssignments = async () => {
  const { data } = await supabase.auth.getSession();
  const { data: assignments, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("user_id", data.session?.user.id!)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  } else {
    return assignments;
  }
};

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

export async function fetchSubjectsByUserId(userId: string): Promise<Subject[]> {
  if (!userId) {
    throw new Error('UserId is required');
  }

  const { data, error } = await supabase
    .from('subject')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data as unknown as Subject[];
}

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

export type Assignments = Awaited<ReturnType<typeof fetchAssignments>>;
export type Subjects = Awaited<ReturnType<typeof fetchSubjects>>;
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];