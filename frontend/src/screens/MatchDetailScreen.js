import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserMatch  } from "../api/client";
import FiguritaImage from "../components/FiguritaImage";

export default function MatchDetailScreen({ route, navigation }) {
  const { userId, username } = route.params;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getUserMatch(userId);
      setMatch(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openMaps() {
    if (!match?.user) return;
    const { latitude, longitude } = match.user;
    if (!latitude || !longitude) {
      Alert.alert("Sin ubicación", "Este usuario no tiene ubicación registrada.");
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se pudo cargar el match</Text>
      </View>
    );
  }

  const { user, matchingFiguritas } = match;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.userCard}>
        {user.avatarId ? (
          <FiguritaImage imagenId={user.avatarId} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {user.username?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.username}</Text>
          <Text style={styles.matchCount}>
            {matchingFiguritas.length} figurita{matchingFiguritas.length !== 1 ? "s" : ""} que te puede dar
          </Text>
        </View>
        {user.latitude && user.longitude && (
          <TouchableOpacity style={styles.mapBtn} onPress={openMaps} activeOpacity={0.8}>
            <Text style={styles.mapBtnText}>📍 Ver en mapa</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Figuritas para intercambiar</Text>
        <Text style={styles.sectionSub}>Las que {user.username} tiene y vos querés</Text>
      </View>

      <FlatList
        data={matchingFiguritas}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.figCard}>
            <FiguritaImage imagenId={item.imagenId} style={styles.figImage} />
            <Text style={styles.figName} numberOfLines={2}>
              {item.nombre}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay figuritas en común</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" },
  errorText: { color: "#f87171", fontSize: 16 },
  header: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4 },
  backBtn: { paddingVertical: 6 },
  backText: { color: "#3b82f6", fontSize: 17, fontWeight: "600" },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    margin: 14,
    marginTop: 4,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#334155",
    flexWrap: "wrap",
  },
  avatar: { width: 54, height: 54, borderRadius: 27 },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { color: "#94a3b8", fontSize: 22, fontWeight: "700" },
  userInfo: { flex: 1 },
  userName: { color: "#f1f5f9", fontSize: 17, fontWeight: "700" },
  matchCount: { color: "#22c55e", fontSize: 13, fontWeight: "600", marginTop: 2 },
  mapBtn: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  mapBtnText: { color: "#3b82f6", fontSize: 13, fontWeight: "600" },
  sectionHeader: { paddingHorizontal: 18, marginBottom: 12 },
  sectionTitle: { color: "#f1f5f9", fontSize: 16, fontWeight: "700" },
  sectionSub: { color: "#64748b", fontSize: 13, marginTop: 2 },
  list: { paddingHorizontal: 12, paddingBottom: 32 },
  row: { justifyContent: "flex-start", gap: 10, marginBottom: 10 },
  figCard: {
    width: "30%",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  figImage: {
    width: "100%",
    aspectRatio: 0.72,
    backgroundColor: "#334155",
  },
  figName: {
    color: "#cbd5e1",
    fontSize: 11,
    padding: 6,
    minHeight: 32,
  },
  empty: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#64748b", fontSize: 15 },
});
