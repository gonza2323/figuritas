import React, { useState, useEffect, useCallback } from "react";
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
import { getMyFiguritas, updateFiguritaStatus  } from "../api/client";
import FiguritaImage from "../components/FiguritaImage";

export default function CollectionScreen() {
  const [figuritas, setFiguritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all | owned | wanted
  const [updating, setUpdating] = useState({}); // { [id]: true }

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getMyFiguritas();
      setFiguritas(data);
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

  async function toggleOwned(fig) {
    if (updating[fig.id]) return;
    setUpdating((u) => ({ ...u, [fig.id]: true }));
    const newOwned = !fig.owned;
    // Optimistic update
    setFiguritas((prev) =>
      prev.map((f) => (f.id === fig.id ? { ...f, owned: newOwned } : f))
    );
    try {
      await updateFiguritaStatus(fig.id, newOwned, fig.wanted);
    } catch {
      // Revert
      setFiguritas((prev) =>
        prev.map((f) => (f.id === fig.id ? { ...f, owned: fig.owned } : f))
      );
    } finally {
      setUpdating((u) => ({ ...u, [fig.id]: false }));
    }
  }

  async function toggleWanted(fig) {
    if (updating[fig.id]) return;
    setUpdating((u) => ({ ...u, [fig.id]: true }));
    const newWanted = !fig.wanted;
    setFiguritas((prev) =>
      prev.map((f) => (f.id === fig.id ? { ...f, wanted: newWanted } : f))
    );
    try {
      await updateFiguritaStatus(fig.id, fig.owned, newWanted);
    } catch {
      setFiguritas((prev) =>
        prev.map((f) => (f.id === fig.id ? { ...f, wanted: fig.wanted } : f))
      );
    } finally {
      setUpdating((u) => ({ ...u, [fig.id]: false }));
    }
  }

  const filtered = figuritas.filter((f) => {
    if (filter === "owned") return f.owned;
    if (filter === "wanted") return f.wanted;
    return true;
  });

  const ownedCount = figuritas.filter((f) => f.owned).length;
  const wantedCount = figuritas.filter((f) => f.wanted).length;

  function renderItem({ item }) {
    const isUpdating = updating[item.id];
    return (
      <View style={styles.card}>
        <FiguritaImage imagenId={item.imagenId} style={styles.cardImage} />
        <Text style={styles.cardName} numberOfLines={2}>{item.nombre}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.badge, item.owned && styles.badgeOwned]}
            onPress={() => toggleOwned(item)}
            disabled={isUpdating}
            activeOpacity={0.75}
          >
            <Text style={[styles.badgeText, item.owned && styles.badgeTextActive]}>
              {item.owned ? "✓ La tengo" : "La tengo"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.badge, item.wanted && styles.badgeWanted]}
            onPress={() => toggleWanted(item)}
            disabled={isUpdating}
            activeOpacity={0.75}
          >
            <Text style={[styles.badgeText, item.wanted && styles.badgeTextActive]}>
              {item.wanted ? "★ La quiero" : "La quiero"}
            </Text>
          </TouchableOpacity>
        </View>
        {isUpdating && (
          <View style={styles.cardOverlay}>
            <ActivityIndicator color="#3b82f6" size="small" />
          </View>
        )}
      </View>
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
        <Text style={styles.title}>Mi Colección</Text>
        <Text style={styles.stats}>
          {ownedCount}/{figuritas.length} 🃏 · {wantedCount} ★
        </Text>
      </View>

      <View style={styles.filterRow}>
        {[
          { key: "all", label: "Todas" },
          { key: "owned", label: "Las tengo" },
          { key: "wanted", label: "Las quiero" },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
            <Text style={styles.emptyText}>No hay figuritas en este filtro</Text>
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
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#fff" },
  stats: { fontSize: 13, color: "#64748b" },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterBtnActive: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  filterText: { color: "#64748b", fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  list: { paddingHorizontal: 12, paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardImage: {
    width: "100%",
    aspectRatio: 0.72,
    backgroundColor: "#334155",
  },
  cardName: {
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
    minHeight: 38,
  },
  cardActions: {
    flexDirection: "row",
    gap: 6,
    padding: 8,
    paddingTop: 4,
  },
  badge: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#334155",
    alignItems: "center",
  },
  badgeOwned: { backgroundColor: "#166534" },
  badgeWanted: { backgroundColor: "#1e3a5f" },
  badgeText: { color: "#94a3b8", fontSize: 11, fontWeight: "600" },
  badgeTextActive: { color: "#fff" },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#64748b", fontSize: 16 },
});
