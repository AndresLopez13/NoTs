export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Subject {
  id: string;
  name: string;
  nrc: number;  
  classroom: string; 
  schedule: ScheduleItem[];
}

export interface DaySchedule {
  [key: string]: {
    subject: string;
    nrc: number; 
    classroom: string;  
    startTime: string;
    endTime: string;
  }[];
}

export function processScheduleData(subjects: Subject[]): DaySchedule {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const schedule: DaySchedule = {};

  days.forEach(day => {
    schedule[day] = [];
  });

  subjects.forEach(subject => {
    subject.schedule.forEach(item => {
      schedule[item.day].push({
        subject: subject.name,
        nrc: subject.nrc,  
        classroom: subject.classroom, 
        startTime: item.startTime,
        endTime: item.endTime,
      });
    });
  });

  Object.keys(schedule).forEach(day => {
    schedule[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return schedule;
}