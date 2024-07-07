import { StyleSheet } from 'react-native';
import { Button, Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';

export default function SignOut() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerrar Sesión</Text>
      <View style={styles.separator} lightColor="#bcbcbc" darkColor="#bcbcbc" />
      <Button title="Cerrar sesión" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
