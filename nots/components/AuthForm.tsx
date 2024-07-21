import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  useColorScheme,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Text, TextInput, View } from "./Themed";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~])[A-Za-z\d!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]{8,}$/;

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
  const [mode, setMode] = useState<"login" | "signUp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "signUp" : "login"));
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const validateEmail = (email) => email.includes("@espe.edu.ec");
  const validatePassword = (password) => strongPasswordRegex.test(password);

  const handleSubmit = () => {
    if (mode === "login") {
      onLogin({ email, password });
    } else {
      if (!validateEmail(email)) {
        Alert.alert(
          "Correo no válido",
          "El correo debe ser del dominio @espe.edu.ec"
        );
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error de contraseña", "Las contraseñas no coinciden");
        return;
      }
      if (!validatePassword(password)) {
        Alert.alert(
          "Contraseña débil",
          "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una minúscula, un número y un carácter especial"
        );
        return;
      }
      onSignUp({
        email,
        password,
        options: { data: { username: email.split("@")[0] } },
      });
      Alert.alert(
        "Registro exitoso",
        "Se ha enviado un correo de confirmación a su email."
      );
      setMode("login");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.inner}>
              <Image
                source={require("../assets/images/NoTs.png")}
                style={styles.logo}
              />
              <Text style={[styles.title, isDarkMode && styles.titleDark]}>
                {mode === "login"
                  ? "Inicia sesión en tu cuenta"
                  : "Crea una cuenta"}
              </Text>
              <EmailInput
                isDarkMode={isDarkMode}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
              />
              <PasswordInput
                isDarkMode={isDarkMode}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />
              {mode === "signUp" && (
                <PasswordInput
                  isDarkMode={isDarkMode}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  showPassword={showConfirmPassword}
                  toggleShowPassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              )}
              <Button
                title={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                onPress={handleSubmit}
                disabled={loading || !email || !password}
                style={styles.submitButton}
              />
              <View style={styles.footer}>
                <Text
                  style={[
                    styles.switchText,
                    isDarkMode && styles.switchTextDark,
                  ]}
                >
                  {mode === "login"
                    ? "¿No tienes una cuenta?"
                    : "¿Ya tienes una cuenta?"}
                </Text>
                <Button
                  title={mode === "login" ? "Crear cuenta" : "Inicia sesión"}
                  onPress={toggleMode}
                  style={styles.switchButton}
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
    backgroundColor: "#f0f0f0",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    color: "#262626",
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#999",
  },
  subtitleDark: {
    color: "#aaa",
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 44,
    borderColor: "#dbdbdb",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#262626",
  },
  inputDark: {
    backgroundColor: "#363636",
    borderColor: "#505050",
    color: "#fff",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  emailInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 10,
    color: "#262626",
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  passwordContainerDark: {
    backgroundColor: "#363636",
    borderColor: "#505050",
  },
  passwordInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 10,
    color: "#262626",
    backgroundColor: "#fff",
  },
  eyeIcon: {
    padding: 10,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30, // Radio de bordes más redondo
    backgroundColor: "#3897f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  switchText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8, // Espacio entre texto y botón
  },
  switchTextDark: {
    color: "#aaa",
  },
  switchButton: {
    padding: 12,
    borderRadius: 50, // Radio de bordes más redondo
    backgroundColor: "#3897f0",
    alignItems: "center",
    width: "50%",
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

function EmailInput({ isDarkMode, placeholder, value, onChangeText }) {
  return (
    <View style={[styles.emailContainer, isDarkMode && styles.inputDark]}>
      <TextInput
        style={[styles.emailInput, isDarkMode && styles.inputDark]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
    </View>
  );
}

function PasswordInput({
  isDarkMode,
  placeholder,
  value,
  onChangeText,
  showPassword,
  toggleShowPassword,
}) {
  return (
    <View
      style={[
        styles.passwordContainer,
        isDarkMode && styles.passwordContainerDark,
      ]}
    >
      <TextInput
        style={[styles.passwordInput, isDarkMode && styles.inputDark]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        textContentType="password"
      />
      <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
        <Icon
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color={isDarkMode ? "#aaa" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
}
