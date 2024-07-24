import { useEffect, useState, useCallback } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { processScheduleData } from '../../lib/scheduleUtils';
import WeekSchedule from '../../components/WeekSchedule';
import { deleteDayFromSubject, deleteEntireSubject, fetchSubjectById, fetchSubjectsByUserId } from '@/lib/api/Subject';
import { useUserInfo } from '@/lib/userContext';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';  
import React from "react";
import { ScheduleItem, DaySchedule } from '@/types/Schedule';
import EditSubjectForm from '@/components/EditSubjectForm';

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState<DaySchedule | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const { session: userSession } = useUserInfo();
  const userId = userSession?.user.id;
  const navigation = useNavigation();
  const menuIconColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');

  const loadSchedule = useCallback(async () => {
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
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadSchedule();
    }, [loadSchedule])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={navigation.goBack}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={menuIconColor} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, menuIconColor]);

  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (updatedItem: ScheduleItem) => {
    try {
      setSchedule(prevSchedule => {
        const newSchedule = { ...prevSchedule };
        const daySchedule = newSchedule[updatedItem.day];
        const itemIndex = daySchedule.findIndex(item => item.id === updatedItem.id);
        if (itemIndex !== -1) {
          daySchedule[itemIndex] = updatedItem;
        }
        return newSchedule;
      });

      setEditingItem(null);
      Alert.alert('Éxito', 'Asignatura actualizado correctamente');
    } catch (error) {
      console.error('Error updating schedule:', error);
      Alert.alert('Error', 'Hubo un error al actualizar!');
    }
  };

  const handleDelete = async (item: ScheduleItem) => {
    try {
      const subject = await fetchSubjectById(item.subjectId);
      if (subject.schedule.length > 1) {
        Alert.alert(
          "Eliminar asignatura",
          "¿Qué deseas eliminar?",
          [
            {
              text: "Cancelar",
              style: "cancel"
            },
            {
              text: "Solo este día",
              onPress: async () => {
                await deleteDayFromSubject(item);
                updateScheduleState(item, 'day');
                Alert.alert('Éxito', 'Día de clase eliminado correctamente');
              }
            },
            {
              text: "Toda la asignatura",
              onPress: async () => {
                await deleteEntireSubject(item.subjectId);
                updateScheduleState(item, 'subject');
                Alert.alert('Éxito', 'Asignatura eliminada correctamente');
              }
            }
          ]
        );
      } else {
        await deleteEntireSubject(item.subjectId);
        updateScheduleState(item, 'subject');
        Alert.alert('Éxito', 'Asignatura eliminada correctamente');
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
      Alert.alert('Error', 'Hubo un error al eliminar. Por favor, intenta de nuevo.');
    }
  };

  const updateScheduleState = (item: ScheduleItem, deleteType: 'day' | 'subject') => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      if (deleteType === 'day') {
        newSchedule[item.day] = newSchedule[item.day].filter(
          scheduleItem => scheduleItem.id !== item.id
        );
      } else {
        Object.keys(newSchedule).forEach(day => {
          newSchedule[day] = newSchedule[day].filter(
            scheduleItem => scheduleItem.subjectId !== item.subjectId
          );
        });
      }
      return newSchedule;
    });
  };

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
    <View style={{ flex: 1 }}>
      <WeekSchedule schedule={schedule} onEditItem={handleEditItem} />
      <Modal
        visible={editingItem !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingItem(null)}
      >
        {editingItem && (
          <EditSubjectForm
            item={editingItem}
            onSubmit={handleUpdateItem}
            onDelete={handleDelete}
            onClose={() => setEditingItem(null)}
          />
        )}
      </Modal>
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