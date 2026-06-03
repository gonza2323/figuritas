import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = username.trim() && password;

  async function handleLogin() {
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e) {
      setError(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>⚽</Text>
          <Text style={styles.title}>Figuritas 2026</Text>
          <Text style={styles.subtitle}>Intercambiá con tu barrio</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, (!canSubmit || loading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!canSubmit || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.linkText}>
              ¿No tenés cuenta?{" "}
              <Text style={styles.linkBold}>Registrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 28 },
  header: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 30, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: "#94a3b8", marginTop: 6 },
  form: { gap: 12 },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  error: {
    color: "#f87171",
    textAlign: "center",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: "#334155" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  linkButton: { alignItems: "center", marginTop: 12 },
  linkText: { color: "#94a3b8", fontSize: 15 },
  linkBold: { color: "#3b82f6", fontWeight: "700" },
});
