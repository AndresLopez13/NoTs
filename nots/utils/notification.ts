import * as Notifications from 'expo-notifications';

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false,
  }),
});

export const scheduleNotification = async (name: string, classroom: string, schedule: DaySchedule[]) => {
  const notificationIds: string[] = [];

  for (const day of schedule) {
    const [hours, minutes] = day.startTime.split(':').map(Number);
    const weekday = daysOfWeek.indexOf(day.day) + 2; // 1 es domingo
    let notificationHour = hours;
    let notificationMinute = minutes - 15;

    if (notificationMinute < 0) {
      notificationHour = (notificationHour - 1 + 24) % 24;
      notificationMinute += 60;
    }

    const trigger = {
      weekday: weekday,
      hour: notificationHour,
      minute: notificationMinute,
      repeats: true,
    };

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Recordatorio de Clase`,
          body: `Tu clase de ${name} en el aula ${classroom} comienza a las ${day.startTime} Hs.`,
        },
        trigger,
      });
      notificationIds.push(identifier);
    } catch (error) {
      console.error(`Error al programar notificación: ${error}`);
    }
  }
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Notificaciones programadas:', JSON.stringify(scheduledNotifications, null, 2));

  return notificationIds;
};

export const cancelNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error(`Error al cancelar notificación: ${error}`);
  }
};
