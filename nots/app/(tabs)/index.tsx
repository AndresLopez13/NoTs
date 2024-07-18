import "react-native-url-polyfill/auto";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  Text,
} from "react-native";
import { useThemeColor } from "@/components/Themed";
import { useRouter } from "expo-router";

interface MenuItem {
  title: string;
  image: any;
  route: string;
}

export default function MenuScreen({ userName = "Usuario" }) {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const menuItemBackgroundColor = useThemeColor({}, "card");

  const menuItems: MenuItem[] = [
    {
      title: "Recordatorios",
      image: require("../../assets/images/menu/reminders.png"),
      route: "/screens/reminders",
    },
    {
      title: "Apuntes",
      image: require("../../assets/images/menu/notes.png"),
      route: "/screens/notes",
    },
    {
      title: "Tareas",
      image: require("../../assets/images/menu/assignments.png"),
      route: "/screens/assignments",
    },
    {
      title: "Pruebas",
      image: require("../../assets/images/menu/exams.png"),
      route: "/screens/exams",
    },
  ];

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: menuItemBackgroundColor }]}
      onPress={() => router.push(item.route)}
    >
      <Image source={item.image} style={styles.menuImage} />
      <Text style={[styles.menuText, { color: textColor }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.greeting, { color: textColor }]}>
        Hola, {userName}, ¿qué vas a hacer hoy?
      </Text>
      <View style={styles.sectionTop}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Registro de Materias
        </Text>
        <TouchableOpacity
          style={[
            styles.menuItem,
            { backgroundColor: menuItemBackgroundColor },
          ]}
          onPress={() => router.push("/screens/subjects")}
        >
          <Image
            source={require("../../assets/images/menu/subjects.png")}
            style={styles.menuImage}
          />
          <Text style={[styles.menuText, { color: textColor }]}>Materias</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.sectionTitle,
          { color: textColor, alignSelf: "flex-start", marginLeft: 16 },
        ]}
      >
        Registro de Actividades
      </Text>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.title}
        numColumns={2}
        key={"four-buttons"}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4", // Un color de fondo más neutro que puede ser más fácil para los ojos
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    padding: 20,
    textAlign: "left",
  },
  sectionTop: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: 16,
  },
  column: {
    justifyContent: "space-between",
    width: "100%",
  },
  menuItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 15,
    backgroundColor: "#fff",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 5,
  },
  menuImage: {
    width: 60, // Tamaño ligeramente mayor para mejorar la visibilidad
    height: 60,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 16, // Asegura consistencia en la alineación del texto
    textAlign: "left",
  },
});

