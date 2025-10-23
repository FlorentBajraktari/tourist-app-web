import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { IconButton, Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import FilterChips from "../components/FilterChips";

const initialRegion = {
  latitude: 42.5863,
  longitude: 20.9029,
  latitudeDelta: 1.2,
  longitudeDelta: 1.2,
};

const markerColors = {
  hotel: "#0052cc",
  restaurant: "#c2185b",
  event: "#2e7d32",
};

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#523735" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9b2a6" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#a5b076" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#b9d3c2" }],
  },
];

const MapScreen = ({ combined, onSelect }) => {
  const theme = useTheme();
  const [region, setRegion] = useState(initialRegion);
  const [filter, setFilter] = useState("all");

  const markers = useMemo(() => {
    const source = filter === "all" ? combined : combined.filter((item) => item.kind === filter);
    return source.filter((item) => item.latitude && item.longitude);
  }, [combined, filter]);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        customMapStyle={mapStyle}
      >
        {markers.map((item) => (
          <Marker
            key={`${item.kind}-${item.id}`}
            coordinate={{
              latitude: Number(item.latitude),
              longitude: Number(item.longitude),
            }}
            pinColor={markerColors[item.kind] ?? theme.colors.primary}
            title={item.name}
            description={item.description}
          >
            <Callout tooltip onPress={() => onSelect(item)}>
              <View style={styles.calloutContainer}>
                <Text variant="labelLarge" style={styles.calloutTitle}>
                  {item.name}
                </Text>
                {!!(item.city || item.location) && (
                  <Text variant="bodySmall" style={styles.calloutSubtitle}>
                    {item.city || item.location}
                  </Text>
                )}
                <Text variant="bodySmall" numberOfLines={2} style={styles.calloutBody}>
                  {item.description}
                </Text>
                <Text variant="bodySmall" style={styles.calloutHint}>
                  Tap to view details
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.overlayTop} pointerEvents="box-none">
        <LinearGradient colors={["rgba(18,35,90,0.85)", "rgba(18,35,90,0.55)"]} style={styles.overlayCard}>
          <View style={styles.overlayTextBlock}>
            <Text variant="titleMedium" style={styles.overlayTitle}>
              Harta interaktive e Kosovës
            </Text>
            <Text variant="bodySmall" style={styles.overlaySubtitle}>
              Po shfaq {markers.length} pika të kuruara
            </Text>
          </View>
          <IconButton
            icon="crosshairs-gps"
            mode="contained"
            onPress={() => setRegion(initialRegion)}
            containerColor="rgba(255,255,255,0.2)"
            iconColor="#fff"
          />
        </LinearGradient>
        <FilterChips selected={filter} onSelect={setFilter} dense />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayTop: {
    position: "absolute",
    top: 32,
    left: 0,
    right: 0,
    gap: 12,
    paddingHorizontal: 16,
  },
  overlayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  overlayTextBlock: {
    flex: 1,
  },
  overlayTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  overlaySubtitle: {
    color: "rgba(255,255,255,0.82)",
    marginTop: 4,
  },
  calloutContainer: {
    width: 220,
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 16,
  },
  calloutTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
  },
  calloutSubtitle: {
    color: "rgba(255,255,255,0.75)",
    marginBottom: 8,
  },
  calloutBody: {
    color: "rgba(255,255,255,0.8)",
  },
  calloutHint: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 10,
  },
});

export default MapScreen;
