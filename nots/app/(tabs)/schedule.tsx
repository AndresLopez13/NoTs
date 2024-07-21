import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { processScheduleData, DaySchedule } from '../../lib/scheduleUtils';
import WeekSchedule from '../../components/WeekSchedule';
import { fetchSubjectsByUserId } from '@/lib/api';
import { useUserInfo } from '@/lib/userContext';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from "react";

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState<DaySchedule | null>(null);
  const { session: userSession } = useUserInfo();
  const userId = userSession?.user.id;
  const navigation = useNavigation();
  const menuIconColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={24} style={[{ marginRight: 20, marginLeft: 15 }, { color: menuIconColor }]} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, menuIconColor]);

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