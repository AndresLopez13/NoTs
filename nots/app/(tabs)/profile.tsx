import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Button, Text, View, TextInput, useThemeColor } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useUserInfo } from '@/lib/userContext';
import Avatar from '@/components/Avatar';
import * as ImagePicker from "expo-image-picker";
import { downloadAvatar } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { profile: userProfile, session: userSession, loading, saveProfile } = useUserInfo();
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || '');
  const [avatarUpdated, setAvatarUpdated] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(userProfile?.username || '');
  const iconColor = useThemeColor({ light: '#4a4a4a', dark: '#dfdfdf' }, 'text');

  useEffect(() => {
    if (userProfile?.avatar_url) {
      setAvatarUrl(userProfile.avatar_url);
    }
    if (userProfile?.avatar_url) {
      downloadAvatar(userProfile.avatar_url).then(setAvatarUrl)
    }
    if (userProfile?.username) {
      setUsername(userProfile.username);
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    if (userProfile) {
      try {
        const updatedProfile = { ...userProfile };
        
        if (username !== userProfile.username) {
          updatedProfile.username = username;
        }
        
        if (avatarUpdated) {
          updatedProfile.avatar_url = avatarUrl;
        }

        await saveProfile(updatedProfile, avatarUpdated);
        Alert.alert("Éxito", "Perfil actualizado correctamente");
        setIsEditingUsername(false);
        setAvatarUpdated(false);  // Resetea el estado de actualización del avatar
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

  const toggleUsernameEdit = () => {
    setIsEditingUsername(!isEditingUsername);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.avatarButton} onPress={handlePickAvatar}>
          <Avatar uri={avatarUrl} size={180} />
        </TouchableOpacity>
        <View style={styles.usernameContainer}>
          {isEditingUsername ? (
            <TextInput
              style={styles.usernameInput}
              value={username}
              onChangeText={setUsername}
              autoFocus
            />
          ) : (
            <Text style={styles.title}>{username}</Text>
          )}
          <TouchableOpacity onPress={toggleUsernameEdit}>
            <Ionicons 
              name={isEditingUsername ? "checkmark-circle-outline" : "create-outline"} 
              size={24} 
              style={{ color: iconColor }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>{userSession?.user.email}</Text>
        <Button
          title="Guardar cambios"
          onPress={handleSubmit}
          disabled={loading || (!avatarUpdated && username === userProfile?.username)}
        />
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        <Button title="Cerrar sesión" onPress={() => supabase.auth.signOut()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  avatarButton: {
    paddingBottom: 24,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  usernameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginRight: 10,
    paddingBottom: 2,
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