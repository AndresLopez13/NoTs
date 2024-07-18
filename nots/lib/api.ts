import { supabase } from "./supabase";

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

export type Assignments = Awaited<ReturnType<typeof fetchAssignments>>;
export type Subjects = Awaited<ReturnType<typeof fetchSubjects>>;
