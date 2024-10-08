import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primaryColor,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Horario",
          headerTitle: "Mi Horario",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primaryColor,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerTitle: "Mi Perfil",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primaryColor,
        }}
      />
    </Tabs>
  );
}
