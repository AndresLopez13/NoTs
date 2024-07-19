import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { processScheduleData, DaySchedule } from '../../lib/scheduleUtils';
import WeekSchedule from '../../components/WeekSchedule';
import { fetchSubjectsByUserId } from '@/lib/api';
import { useUserInfo } from '@/lib/userContext';
import { Text, View } from '@/components/Themed';

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
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.largeText}>Usuario no válido</Text>
      </View>
    );
  }

  if (!schedule) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.largeText}>Cargando horario...</Text>
      </View>
    );
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
    justifyContent: 'center',
    padding: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ScheduleScreen;