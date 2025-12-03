import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../BasedeDatos/Firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("✅ Bienvenido", "Has iniciado sesión correctamente");
      navigation.navigate("Home");
    } catch (error) {
      let errorMessage = "Ocurrió un error inesperado.";
      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "El correo electrónico o la contraseña son incorrectos.";
          break;
        case "auth/user-not-found":
          errorMessage = "No se encontró ninguna cuenta con este correo electrónico.";
          break;
        case "auth/wrong-password":
          errorMessage = "La contraseña es incorrecta.";
          break;
        default:
          errorMessage = error.message;
          break;
      }
      Alert.alert("❌ Error", errorMessage);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      Alert.alert("⚠️ Ingresa tu correo", "Debes escribir tu correo para recuperar tu contraseña.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("📩 Revisa tu correo", "Te enviamos un enlace para restablecer tu contraseña.");
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Image source={require("../assets/logi/1.png")} style={styles.logo} />
          
            <Text style={styles.subtitle}>Inicio de sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#000000ff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={loginUser}>
              <Text style={styles.buttonText}>Inicia Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate("Register")}>
              <Text style={styles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetPassword}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // fondo blanco
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  logo: {
    width: 500,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1d2570",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  button: {
    backgroundColor: "#294b29",
    padding: 15,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonSecondary: {
    backgroundColor: "#294b29",
    padding: 15,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  link: {
    color: "#1d2570",
    textDecorationLine: "underline",
  },
});
