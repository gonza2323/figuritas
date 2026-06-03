import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function confirmLogout() {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que querés salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: logout },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.userId}>Usuario #{user?.id}</Text>
          <Text style={styles.hint}>Mundial 2026 · Figuritas</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ID de usuario</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{user?.id}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 12, paddingBottom: 20 },
  title: { fontSize: 22, fontWeight: "800", color: "#fff" },
  profileCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarEmoji: { fontSize: 36 },
  userId: { color: "#f1f5f9", fontSize: 20, fontWeight: "700" },
  hint: { color: "#64748b", fontSize: 14, marginTop: 4 },
  section: { marginBottom: 16 },
  sectionLabel: { color: "#64748b", fontSize: 13, fontWeight: "600", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  infoRow: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  infoValue: { color: "#f1f5f9", fontSize: 15 },
  logoutBtn: {
    marginTop: "auto",
    marginBottom: 24,
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  logoutText: { color: "#ef4444", fontSize: 16, fontWeight: "700" },
});
