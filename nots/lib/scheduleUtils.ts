import { Subject, DaySchedule, ScheduleItem } from '../types/Schedule';

export function processScheduleData(subjects: Subject[]): DaySchedule {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const schedule: DaySchedule = {};

  days.forEach(day => {
    schedule[day] = [];
  });

  subjects.forEach(subject => {
    subject.schedule.forEach(item => {
      const scheduleItem: ScheduleItem = {
        id: `${subject.id}-${item.day}-${item.startTime}`, 
        subjectId: subject.id,
        subject: subject.name,
        nrc: subject.nrc,
        classroom: subject.classroom,
        startTime: item.startTime,
        endTime: item.endTime,
        day: item.day,
      };
      schedule[item.day].push(scheduleItem);
    });
  });

  Object.keys(schedule).forEach(day => {
    schedule[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return schedule;
}