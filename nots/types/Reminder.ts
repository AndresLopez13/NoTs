export interface Reminder {
  id: string;
  type: string;
  name: string;
  description: string;
  date?: string;
  time?: string;
  user_id: string;
  subject_id: string;
}

export interface Reminders {
  reminders: Reminder[];
}
