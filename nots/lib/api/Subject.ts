import { supabase } from "../supabase";
import { ScheduleItem, Subject } from "../../types/Schedule";
import * as Notifications from 'expo-notifications';
import { scheduleNotification, cancelNotification } from '../../utils/notification';

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

export async function fetchSubjectsByUserId( //busca todas las asignaturas de un usuario
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

export async function fetchSubjectById(subjectId: string): Promise<Subject> { //busca una asignatura específica por su ID
  if (!subjectId) {
    throw new Error("SubjectId is required");
  }

  const { data, error } = await supabase
    .from("subject")
    .select("*")
    .eq("id", subjectId)
    .single();

  if (error) throw error;
  return data as unknown as Subject;
}

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

export async function deleteDayFromSubject(item: ScheduleItem) {
  const { data: subject, error: fetchError } = await supabase
    .from('subject')
    .select('schedule')
    .eq('id', item.subjectId)
    .single();

  if (fetchError) throw fetchError;
  if (!subject || !subject.schedule) throw new Error('Subject or schedule not found');

  const updatedSchedule = subject.schedule.filter((s: any) => s.day !== item.day);

  const { data, error } = await supabase
    .from('subject')
    .update({ schedule: updatedSchedule })
    .eq('id', item.subjectId);

  if (error) throw error;
  return data;
}

export async function deleteEntireSubject(subjectId: string) {
  const subject = await fetchSubjectById(subjectId);
  const notificationIds = subject.notification_ids || []; //borra todas las notificaciones asociadas a la asignatura

  for (const id of notificationIds) {
    await cancelNotification(id);
  }

  const { data, error } = await supabase
    .from('subject')
    .delete()
    .eq('id', subjectId);

  if (error) throw error;
  return data;
}

export type Subjects = Awaited<ReturnType<typeof fetchSubjects>>;
