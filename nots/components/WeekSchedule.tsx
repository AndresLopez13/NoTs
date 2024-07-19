import { StyleSheet, ScrollView, Image, ImageSourcePropType } from 'react-native';
import { View, Text, useThemeColor } from './Themed';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleItem {
  subject: string;
  nrc: number;
  classroom: string;
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  [key: string]: ScheduleItem[];
}

interface WeekScheduleProps {
  schedule: DaySchedule;
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({ schedule }) => {
  const dayTextColor = useThemeColor({ light: 'black', dark: 'black' }, 'text');
  const iconColor = useThemeColor({ light: '#4a4a4a', dark: '#dfdfdf' }, 'text');
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.separator}></View>
      {days.map(day => (
        <View key={day} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={[styles.dayHeaderText, { color: dayTextColor }]}>{day}</Text>
            <Image source={dayImages[day]} style={styles.dayIcon} />
          </View>
          <ScrollView style={styles.subjectsContainer}>
            {schedule[day].map((item, index) => (
              <View key={index} style={styles.classItem}>
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
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    paddingTop: 10,
  },
  dayCard: {
    backgroundColor: '#e5e5e5',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 65,
    backgroundColor: '#e5e5e5'
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
    maxHeight: 400,
  },
  classItem: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  classItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  },
});

export default WeekSchedule;