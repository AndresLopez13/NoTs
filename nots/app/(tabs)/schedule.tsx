import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { processScheduleData, DaySchedule } from '../../lib/scheduleUtils';
import WeekSchedule from '../../components/WeekSchedule';
import { fetchSubjectsByUserId } from '@/lib/api';
import { useUserInfo } from '@/lib/userContext';

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState<DaySchedule | null>(null);
  const { session: userSession } = useUserInfo();
  const userId = userSession?.user.id;
  
  useEffect(() => {
    async function loadSchedule() {
      if (!userId) {
        console.error('UserId is undefined');
        return;
      }

      try {
        const subjects = await fetchSubjectsByUserId(userId);
        const processedSchedule = processScheduleData(subjects);
        setSchedule(processedSchedule);
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    }

    loadSchedule();
  }, [userId]);

  if (!userId) {
    return <Text>Usuario no válido</Text>;
  }

  if (!schedule) {
    return <Text>Cargando horario...</Text>;
  }

  return (
    <View style={styles.container}>
      <WeekSchedule schedule={schedule} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScheduleScreen;