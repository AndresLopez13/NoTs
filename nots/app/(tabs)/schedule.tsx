import { StyleSheet } from "react-native";
import { Button, Text, View } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { useUserInfo } from "@/lib/userContext";

export default function profile() {
  const profile = useUserInfo().profile;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile?.username}</Text>
      <Button title="Cerrar sesión" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
