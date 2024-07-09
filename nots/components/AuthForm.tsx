import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Button, Text, TextInput, View } from './Themed';

import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';

interface AuthFormProps {
  onSignUp: (credentials: SignUpWithPasswordCredentials) => void;
  onLogin: (credentials: SignInWithPasswordCredentials) => void;
  loading: boolean;
}

export default function AuthForm({
  onSignUp,
  onLogin,
  loading,
}: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signUp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      const username = email.split('@')[0];
      onSignUp({ email, password, options: { data: { username } } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.inner}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>NoTs</Text>
              <Text style={styles.subtitle}>
                {mode === 'login'
                  ? 'Inicia sesión en tu cuenta'
                  : 'Crea una cuenta'}
              </Text>
              <View style={styles.input}>
                <TextInput
                  placeholder="Correo"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.input}>
                <Button
                  title={mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                  onPress={handleSubmit}
                  disabled={loading || !email || !password}
                />
              </View>
              <View style={styles.footer}>
                <Text style={{ marginBottom: 8 }}>
                  {mode === 'login'
                    ? '¿No tienes una cuenta?'
                    : '¿Ya tienes una cuenta?'}
                </Text>
                <Button
                  title={mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                  onPress={() => setMode(mode === 'login' ? 'signUp' : 'login')}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inner: {
    padding: 16,
    flex: 1,
    paddingTop: 64,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    paddingVertical: 8,
  },
  footer: {
    paddingTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
