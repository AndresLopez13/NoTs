export interface ScheduleItem {
  id: string;
  subjectId: string;
  subject: string;
  nrc: number;
  classroom: string;
  startTime: string;
  endTime: string;
  day: string;
}

export interface DaySchedule {
  [key: string]: ScheduleItem[];
}

export interface Subject {
  id: string;
  name: string;
  nrc: number;
  classroom: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface WeekScheduleProps {
  schedule: DaySchedule;
  onEditItem: (item: ScheduleItem) => void;
}