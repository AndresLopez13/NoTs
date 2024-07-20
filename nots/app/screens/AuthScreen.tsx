import { Alert, StyleSheet } from 'react-native'
import { useState } from 'react'
import AuthForm from '@/components/AuthForm'
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);

  const errorMessages: { [key: string]: string } = {
    "Invalid login credentials": "Credenciales de inicio de sesión inválidas",
    "User not found": "Usuario no encontrado",
  };

  const handleSignup = async (credentials: SignUpWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    setLoading(true);
    const { email, password, options } = credentials;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      const translatedMessage = errorMessages[error.message as string] || error.message;
      Alert.alert("Error", translatedMessage);
    }
    setLoading(false);
  };

  const handleLogin = async (credentials: SignInWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    setLoading(true);
    const { email, password } = credentials;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const translatedMessage = errorMessages[error.message as string] || error.message;
      Alert.alert("Error", translatedMessage);
    }
    setLoading(false);
  };

  return (
    <AuthForm onSignUp={handleSignup} onLogin={handleLogin} loading={loading} />
  )
}

const styles = StyleSheet.create({})