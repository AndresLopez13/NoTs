import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { processScheduleData } from '../../lib/scheduleUtils';
import WeekSchedule from '../../components/WeekSchedule';
import { deleteSubject, fetchSubjectsByUserId } from '@/lib/api';
import { useUserInfo } from '@/lib/userContext';
import { Text, View, useThemeColor } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
      Alert.alert('Éxito','Asignatura actualizado correctamente');
    } catch (error) {
      console.error('Error updating schedule:', error);
      Alert.alert('Error','Hubo un error al actualizar!');
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteSubject(itemId);
  
      setSchedule(prevSchedule => {
        const newSchedule = { ...prevSchedule };
        Object.keys(newSchedule).forEach(day => {
          newSchedule[day] = newSchedule[day].filter(item => item.subjectId !== itemId);
        });
        return newSchedule;
      });
  
      setEditingItem(null);
      Alert.alert('Éxito', 'Asignatura eliminada correctamente');
    } catch (error) {
      console.error('Error deleting subject:', error);
      Alert.alert('Error', 'Hubo un error al eliminar la asignatura. Por favor, intenta de nuevo.');
    }
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