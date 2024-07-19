import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Session } from "@supabase/supabase-js";
import { Profile } from "./api";
import { supabase } from "./supabase";

export interface UserInfo {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  saveProfile: (updatedProfile: Profile, avatarUpdated: boolean) => Promise<void>;
}

const UserContext = createContext<UserInfo>({
  session: null,
  profile: null,
  loading: false,
  saveProfile: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    session: null,
    profile: null,
    loading: false,
    saveProfile: async () => { },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserInfo((prev) => ({ ...prev, session }));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserInfo((prev) => ({ ...prev, session, profile: null }));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userInfo.session) {
      getProfile();
    }
  }, [userInfo.session]);

  const getProfile = async () => {
    if (!userInfo.session) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userInfo.session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setUserInfo((prev) => ({ ...prev, profile: data }));
    }
  };

  const saveProfile = async (updatedProfile: Partial<Profile>, avatarUpdated: boolean) => {
    setUserInfo((prev) => ({ ...prev, loading: true }));

    try {
      const profileUpdate: Partial<Profile> = {};

      // Solo incluye los campos que han cambiado
      if (updatedProfile.username !== userInfo.profile?.username) {
        profileUpdate.username = updatedProfile.username;
      }

      if (avatarUpdated && updatedProfile.avatar_url) {
        const { avatar_url } = updatedProfile;
        const fileExt = avatar_url.split(".").pop();
        const fileName = avatar_url.replace(/^.*[\\\/]/, "");
        const filePath = `${Date.now()}.${fileExt}`;

        const formData = new FormData();
        const photo = {
          uri: avatar_url,
          name: fileName,
          type: `image/${fileExt}`,
        } as unknown as Blob;
        formData.append("file", photo);

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData);

        if (uploadError) throw uploadError;
        profileUpdate.avatar_url = filePath;
      }

      // Solo realiza la actualización si hay cambios
      if (Object.keys(profileUpdate).length > 0) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update(profileUpdate)
          .eq("id", userInfo.profile?.id!);

        if (updateError) throw updateError;

        await getProfile();
      }
    } catch (error: any) {
      Alert.alert("Server Error", error.message);
    } finally {
      setUserInfo((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <UserContext.Provider value={{ ...userInfo, saveProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserInfo() {
  return useContext(UserContext);
}