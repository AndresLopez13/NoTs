import { StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { View, Text, useThemeColor } from './Themed';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { WeekScheduleProps, ScheduleItem } from '../types/Schedule'

const WeekSchedule: React.FC<WeekScheduleProps> = ({ schedule, onEditItem }) => {
  const dayTextColor = useThemeColor({ light: 'black', dark: 'white' }, 'text');
  const iconColor = useThemeColor({ light: '#4a4a4a', dark: '#dfdfdf' }, 'text');
  const backgroundClassItem = useThemeColor({ light: 'white', dark: '#302f32' }, 'background');
  const dayCardBackground = useThemeColor({ light: '#e5e5e5', dark: '#3e3d40' }, 'background');
  const shadowColor = useThemeColor({ light: '#000', dark: '#8e8e8e' }, 'card');
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const dayImages: { [key: string]: ImageSourcePropType } = {
    Lunes: require('../assets/images/schedule/monday.png'),
    Martes: require('../assets/images/schedule/tuesday.png'),
    Miércoles: require('../assets/images/schedule/wednesday.png'),
    Jueves: require('../assets/images/schedule/thursday.png'),
    Viernes: require('../assets/images/schedule/friday.png'),
    Sábado: require('../assets/images/schedule/saturday.png'),
    Domingo: require('../assets/images/schedule/sunday.png'),
  };

  const getCurrentDay = () => {
    const currentDayIndex = moment().isoWeekday() - 1; // isoWeekday returns 1 for Monday and 7 for Sunday
    return days[currentDayIndex];
  };

  const [visibleDays, setVisibleDays] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const currentDay = getCurrentDay();
    const initialVisibility = days.reduce((acc, day) => {
      acc[day] = day === currentDay;
      return acc;
    }, {} as { [key: string]: boolean });
    setVisibleDays(initialVisibility);
  }, []);

  const toggleVisibility = (day: string) => {
    setVisibleDays(prevState => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  const handleEditItem = (item: ScheduleItem) => {
    onEditItem(item);
  };

  return (
    <ScrollView style={styles.container}>
      {days.map(day => (
        <View key={day} style={[styles.dayCard, { backgroundColor: dayCardBackground }]}>
          <TouchableOpacity style={styles.dayHeader} onPress={() => toggleVisibility(day)}>
            <Image source={dayImages[day]} style={styles.dayIcon} />
            <Text style={[styles.dayHeaderText, { color: dayTextColor }]}>{day}</Text>
            <Ionicons
              name={visibleDays[day] ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={dayTextColor}
            />
          </TouchableOpacity>
          {visibleDays[day] && (
            <View style={styles.subjectsContainer}>
              {schedule[day]?.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.classItem, { backgroundColor: backgroundClassItem }, { shadowColor }]}
                  onPress={() => handleEditItem(item)}
                >
                  <View style={styles.classItemRow}>
                    <Ionicons name="book-outline" size={20} style={[styles.icon, { color: iconColor }]} />
                    <Text style={styles.subjectName}>{item.subject}</Text>
                  </View>
                  <View style={styles.classItemRow}>
                    <Ionicons name="location-outline" size={20} style={[styles.icon, { color: iconColor }]} />
                    <Text style={styles.description}>Aula: {item.classroom}  -  NRC: {item.nrc}</Text>
                  </View>
                  <View style={styles.classItemRow}>
                    <Ionicons name="time-outline" size={20} style={[styles.icon, { color: iconColor }]} />
                    <Text style={styles.description}>{item.startTime} - {item.endTime}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  separator: {
    paddingTop: 10,
  },
  dayCard: {
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  dayHeaderText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  dayIcon: {
    width: 40,
    height: 40,
  },
  subjectsContainer: {
    maxHeight: 1000,
    backgroundColor: 'transparent',
  },
  classItem: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  classItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 10,
    width: 20,
  },
  subjectName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    flex: 1, 
  },
});

export default WeekSchedule;