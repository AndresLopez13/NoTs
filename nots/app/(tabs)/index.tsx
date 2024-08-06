import "react-native-url-polyfill/auto";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, useThemeColor } from "@/components/Themed";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { useUserInfo } from "@/lib/context/userContext";
import { useReminders } from "@/lib/context/remindersContext";
import { validateUser } from "@/utils/user-validation";
import { usePushNotifications } from "../usePushNotifications";

interface MenuItem {
  title: string;
  image: any;
  route: string;
}

export default function MenuScreen() {
  const [userName, setUserName] = useState("Usuario");
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const menuItemBackgroundColor = useThemeColor({}, "card");
  const navigation = useNavigation();
  const menuIconColor = useThemeColor(
    { light: "black", dark: "white" },
    "text"
  );
  const { session } = useUserInfo();
  const { reminders, refreshReminders } = useReminders();
  const { expoPushToken, notification } = usePushNotifications();

  const data = JSON.stringify(notification, undefined, 2);

  const fetchUser = async () => {
    const { data: info } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", session!.user.id)
      .single();
    return info?.username;
  };

  useEffect(() => {
    fetchUser().then((metadata) => {
      if (metadata) {
        setUserName(metadata || "user");
      }
    });

    supabase
      .channel("profiles_users")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        async (payload) => {
          if (await validateUser(payload)) {
            fetchUser().then((metadata) => {
              if (metadata) {
                setUserName(metadata || "user");
              }
            });
          }
        }
      )
      .subscribe();
    supabase
      .channel("subject_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subject",
        },
        async (payload) => {
          if (await validateUser(payload)) {
            refreshReminders();
          }
        }
      )
      .subscribe();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons
            name="menu"
            size={24}
            style={[
              { marginRight: 20, marginLeft: 15 },
              { color: menuIconColor },
            ]}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, menuIconColor]);

  const menuItems: MenuItem[] = [
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
    {
      title: "Apuntes",
      image: require("../../assets/images/menu/notes.png"),
      route: "/screens/notes",
    },
  ];

  return (
    <>
      <Text style={[styles.greeting, { color: textColor }]}>
        Hola, {userName}, ¿qué vas a hacer hoy?
      </Text>
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Agrega algo nuevo...
        </Text>
        <View style={styles.sectionTop}>
          <TouchableOpacity
            style={[
              styles.menuItemTop,
              { backgroundColor: menuItemBackgroundColor },
            ]}
            onPress={() => router.push("/screens/subjects")}
          >
            <Image
              source={require("../../assets/images/menu/subjects.png")}
              style={styles.menuImage}
            />
            <Text style={[styles.menuText, { color: textColor }]}>
              Materias
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItemTop,
              { backgroundColor: menuItemBackgroundColor },
            ]}
            onPress={() => router.push("/screens/reminders")}
          >
            <Image
              source={require("../../assets/images/menu/reminders.png")}
              style={styles.menuImage}
            />
            <Text style={[styles.menuText, { color: textColor }]}>
              Recordatorios
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Mira tus actividades
        </Text>
        <View style={styles.section}>
          {menuItems.slice().map((item) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItemFooter,
                { backgroundColor: menuItemBackgroundColor },
              ]}
              onPress={() => router.push(item.route)}
            >
              <Image source={item.image} style={styles.menuImage} />
              <Text style={[styles.menuText, { color: textColor }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignContent: "center",
    justifyContent: "center",
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
    flexDirection: "row",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  menuItemTop: {
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
  menuItemFooter: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 15,
    backgroundColor: "#fff",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 5,
  },
  menuImage: {
    width: 60,
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
    marginLeft: 16,
    textAlign: "left",
  },
});
