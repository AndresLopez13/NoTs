import { supabase } from "./supabase";

export const fetchAssignments = async () => {
  const { data, error } = await supabase.from("assignments").select("*").order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  } else {
    return data;
  }
};

export type Assignments = Awaited<ReturnType<typeof fetchAssignments>>;