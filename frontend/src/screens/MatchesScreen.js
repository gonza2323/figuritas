import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMatches } from "../api/client";
import FiguritaImage from "../components/FiguritaImage";

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function renderMatch({ item }) {
    const { user, matchingFiguritas } = item;
    const previewFigus = matchingFiguritas.slice(0, 3);
    const extra = matchingFiguritas.length - 3;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("MatchDetail", {
            userId: user.id,
            username: user.username,
          })
        }
      >
        <View style={styles.cardLeft}>
          {user.avatarId ? (
            <FiguritaImage imagenId={user.avatarId} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user.username?.[0]?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardMiddle}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.matchCount}>
            {matchingFiguritas.length} figurita{matchingFiguritas.length !== 1 ? "s" : ""} en común
          </Text>
          <View style={styles.previewRow}>
            {previewFigus.map((fig) => (
              <FiguritaImage
                key={fig.id}
                imagenId={fig.imagenId}
                style={styles.previewImg}
              />
            ))}
            {extra > 0 && (
              <View style={styles.extraBadge}>
                <Text style={styles.extraText}>+{extra}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Matches</Text>
        {matches.length > 0 && (
          <Text style={styles.subtitle}>{matches.length} usuario{matches.length !== 1 ? "s" : ""} cerca</Text>
        )}
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => String(item.user.id)}
        renderItem={renderMatch}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Sin matches por ahora</Text>
            <Text style={styles.emptyText}>
              Marcá las figuritas que querés y esperá a que alguien cerca las tenga.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#fff" },
  subtitle: { fontSize: 13, color: "#64748b" },
  list: { paddingHorizontal: 14, paddingBottom: 24, gap: 10 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  cardLeft: {},
  avatar: { width: 50, height: 50, borderRadius: 25 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { color: "#94a3b8", fontSize: 20, fontWeight: "700" },
  cardMiddle: { flex: 1, gap: 3 },
  username: { color: "#f1f5f9", fontSize: 16, fontWeight: "700" },
  matchCount: { color: "#22c55e", fontSize: 13, fontWeight: "600" },
  previewRow: { flexDirection: "row", gap: 4, marginTop: 4, alignItems: "center" },
  previewImg: {
    width: 32,
    height: 44,
    borderRadius: 4,
    backgroundColor: "#334155",
  },
  extraBadge: {
    width: 32,
    height: 44,
    borderRadius: 4,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  extraText: { color: "#94a3b8", fontSize: 12, fontWeight: "700" },
  cardRight: {},
  arrow: { color: "#475569", fontSize: 26, fontWeight: "300" },
  empty: { alignItems: "center", marginTop: 80, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { color: "#f1f5f9", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  emptyText: { color: "#64748b", fontSize: 15, textAlign: "center", lineHeight: 22 },
});
