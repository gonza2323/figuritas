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
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAuth } from "../context/AuthContext";

export default function RegistryScreen({ navigation }) {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password && password === confirmPassword;
  const canSubmit = username.trim() && passwordsMatch && location;

  async function handleGetLocation() {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso necesario",
          "Necesitamos tu ubicación para mostrar figuritas cerca tuyo.",
          [{ text: "OK" }]
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch (e) {
      Alert.alert("Error", "No pudimos obtener tu ubicación. Intentá de nuevo.");
    } finally {
      setLoadingLocation(false);
    }
  }

  async function handleSignup() {
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await signup(username.trim(), password, confirmPassword, location.lat, location.lng);
    } catch (e) {
      setError(e.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>🃏</Text>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Unite al intercambio</Text>
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
            <TextInput
              style={[
                styles.input,
                confirmPassword && !passwordsMatch && styles.inputError,
              ]}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {confirmPassword && !passwordsMatch && (
              <Text style={styles.fieldError}>Las contraseñas no coinciden</Text>
            )}

            <TouchableOpacity
              style={[styles.locationButton, location && styles.locationButtonDone]}
              onPress={handleGetLocation}
              disabled={loadingLocation}
              activeOpacity={0.8}
            >
              {loadingLocation ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.locationButtonText}>
                  {location
                    ? `📍 Ubicación guardada`
                    : "📍 Obtener mi ubicación"}
                </Text>
              )}
            </TouchableOpacity>
            {location && (
              <Text style={styles.locationHint}>
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </Text>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, (!canSubmit || loading) && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={!canSubmit || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.linkText}>
                ¿Ya tenés cuenta?{" "}
                <Text style={styles.linkBold}>Iniciá sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 28, paddingVertical: 24 },
  header: { alignItems: "center", marginBottom: 36 },
  emoji: { fontSize: 52, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#fff" },
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
  inputError: { borderColor: "#f87171" },
  fieldError: { color: "#f87171", fontSize: 13, marginTop: -6, paddingLeft: 4 },
  error: { color: "#f87171", textAlign: "center", fontSize: 14 },
  locationButton: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    borderStyle: "dashed",
  },
  locationButtonDone: {
    borderColor: "#22c55e",
    borderStyle: "solid",
  },
  locationButtonText: { color: "#94a3b8", fontSize: 15, fontWeight: "600" },
  locationHint: { color: "#22c55e", fontSize: 12, textAlign: "center", marginTop: -6 },
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
