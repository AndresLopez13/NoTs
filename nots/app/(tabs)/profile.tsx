import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button, Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useUserInfo } from '@/lib/userContext';
import Avatar from '@/components/Avatar';
import * as ImagePicker from "expo-image-picker";
import { downloadAvatar } from '@/lib/api';

export default function Profile() {
  const { profile: userProfile, session: userSession, loading, saveProfile } = useUserInfo();
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || '');
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  useEffect(() => {
    if (userProfile?.avatar_url) {
      setAvatarUrl(userProfile.avatar_url);
    }
    if (userProfile?.avatar_url) {
      downloadAvatar(userProfile.avatar_url).then(setAvatarUrl)
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    if (userProfile) {
      try {
        await saveProfile({ ...userProfile, avatar_url: avatarUrl }, avatarUpdated);
        Alert.alert("Éxito", "Perfil actualizado correctamente");
      } catch (error) {
        Alert.alert("Error", "No se pudo actualizar el perfil");
      }
    }
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
      setAvatarUpdated(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.avatarButton} onPress={handlePickAvatar}>
        <Avatar uri={avatarUrl} size={180} />
      </TouchableOpacity>
      <Text style={styles.title}>{userProfile?.username}</Text>
      <Text style={styles.subtitle}>{userSession?.user.email}</Text>
      <Button
        title="Guardar cambios"
        onPress={handleSubmit}
        disabled={loading}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
      <Button title="Cerrar sesión" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'light',
    paddingBottom: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});