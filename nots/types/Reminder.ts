export interface Reminder {
  id: number;
  type: string;
  name: string;
  description: string;
  date: string;
  time: string;
  user_id: string;
  subject_id: string;
}

export interface Exam {
  exams: Reminder[];
}

export interface Task {
  tasks: Reminder[];
}

export interface Notes {
  notes: Reminder[];
}
