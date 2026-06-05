import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout } from "react-native-maps";
import FiguritaImage from "../components/FiguritaImage";

export default function MatchesMapScreen({ route, navigation }) {
  const { matches, myLocation } = route.params;

  const validMatches = matches.filter(
    (m) => m.user.latitude && m.user.longitude
  );

  const initialRegion = myLocation
    ? {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : validMatches.length > 0
    ? {
        latitude: validMatches[0].user.latitude,
        longitude: validMatches[0].user.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: -32.89,
        longitude: -68.84,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mapa de matches</Text>
        <Text style={styles.subtitle}>{validMatches.length} usuarios cerca</Text>
      </View>

      <MapView style={styles.map} initialRegion={initialRegion}>
        {/* Marcador propio */}
        {myLocation && (
          <Marker
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            pinColor="#3b82f6"
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Vos</Text>
              </View>
            </Callout>
          </Marker>
        )}

        {validMatches.map((match) => (
          <Marker
            key={match.user.id}
            coordinate={{
              latitude: match.user.latitude,
              longitude: match.user.longitude,
            }}
            pinColor="#22c55e"
            onCalloutPress={() => {
              navigation.goBack();
              navigation.navigate("MatchDetail", {
                userId: match.user.id,
                username: match.user.username,
              });
            }}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{match.user.username}</Text>
                <Text style={styles.calloutSub}>
                  {match.matchingFiguritas.length} figurita
                  {match.matchingFiguritas.length !== 1 ? "s" : ""} en común
                </Text>
                <Text style={styles.calloutLink}>Tocar para ver detalle</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#3b82f6" }]} />
          <Text style={styles.legendText}>Tu ubicación</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#22c55e" }]} />
          <Text style={styles.legendText}>Matches</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: { paddingVertical: 4, marginBottom: 4 },
  backText: { color: "#3b82f6", fontSize: 17, fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "800", color: "#fff" },
  subtitle: { fontSize: 13, color: "#64748b", marginTop: 2 },
  map: { flex: 1 },
  callout: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 10,
    minWidth: 140,
    borderWidth: 1,
    borderColor: "#334155",
  },
  calloutTitle: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  calloutSub: { color: "#22c55e", fontSize: 12, fontWeight: "600" },
  calloutLink: { color: "#3b82f6", fontSize: 11, marginTop: 4 },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: "#94a3b8", fontSize: 13 },
});