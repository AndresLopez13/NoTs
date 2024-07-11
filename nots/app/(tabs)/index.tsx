import 'react-native-url-polyfill/auto';
import { Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';

interface MenuItem {
  title: string;
  image: any; // 'any' para el require de la imagen
  route: string;
}

export default function MenuScreen() {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { title: 'Asignaturas', image: require('../../assets/images/menu/subjects.png'), route: '/screens/subjects' },
    { title: 'Recordatorios', image: require('../../assets/images/menu/reminders.png'), route: '/screens/reminders' },
    { title: 'Apuntes', image: require('../../assets/images/menu/notes.png'), route: '/screens/notes' },
    { title: 'Tareas', image: require('../../assets/images/menu/assignments.png'), route: '/screens/assignments' },
    { title: 'Pruebas', image: require('../../assets/images/menu/exams.png'), route: '/screens/exams' },
    { title: 'Horario', image: require('../../assets/images/menu/schedule.png'), route: '/screens/schedule' },
  ];

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => router.push(item.route)}
    >
      <Image source={item.image} style={styles.menuImage} />
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  menuImage: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  menuText: {
    fontSize: 18,
  },
});