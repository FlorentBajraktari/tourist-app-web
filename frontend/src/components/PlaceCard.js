import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Chip, IconButton, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const palette = {
  hotel: {
    label: "Hotel",
    colors: ["#4C7CFF", "#5F96FF"],
    icon: "bed-king",
  },
  restaurant: {
    label: "Restaurant",
    colors: ["#FF7C5C", "#FFC371"],
    icon: "silverware-fork-knife",
  },
  event: {
    label: "Event",
    colors: ["#38CDA4", "#1D9DE6"],
    icon: "calendar-star",
  },
  default: {
    label: "Place",
    colors: ["#6C63FF", "#A471FF"],
    icon: "map-marker-radius",
  },
};

const InfoRow = ({ icon, children }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={18} color="#64748b" style={styles.infoIcon} />
    <Text variant="bodySmall" style={styles.infoText}>
      {children}
    </Text>
  </View>
);

const PlaceCard = ({ item, onPress, isFavorite = false, onToggleFavorite = () => {} }) => {
  const meta = palette[item.kind] ?? palette.default;
  const subtitle = item.city || item.location || meta.label;

  return (
    <Card style={styles.card} mode="contained" onPress={onPress}>
      <LinearGradient colors={meta.colors} start={[0, 0]} end={[1, 1]} style={styles.banner}>
        <View style={styles.bannerIcon}>
          <MaterialCommunityIcons name={meta.icon} size={26} color="#fff" />
        </View>
        <View style={styles.bannerText}>
          <Text variant="titleMedium" style={styles.bannerTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={styles.bannerSubtitle}>
            {subtitle}
          </Text>
        </View>
        <Chip textStyle={styles.bannerChipText} style={styles.bannerChip}>
          {meta.label}
        </Chip>
      </LinearGradient>

      <Card.Content style={styles.content}>
        <View style={styles.headerRow}>
          <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
          <IconButton
            icon={isFavorite ? "heart" : "heart-outline"}
            size={22}
            iconColor={isFavorite ? "#ef4444" : "#94a3b8"}
            onPress={(event) => {
              event.stopPropagation?.();
              onToggleFavorite(item);
            }}
            style={styles.favoriteButton}
          />
        </View>

        <View style={styles.infoGrid}>
          {item.price_per_night && <InfoRow icon="currency-eur">€{item.price_per_night} / night</InfoRow>}
          {item.rating && <InfoRow icon="star">Rating {item.rating}</InfoRow>}
          {item.date && <InfoRow icon="calendar-today">{item.date}</InfoRow>}
          {item.city && <InfoRow icon="map-marker-outline">{item.city}</InfoRow>}
          {item.opening_hours && <InfoRow icon="clock-outline">{item.opening_hours}</InfoRow>}
          {item.category && item.kind === "restaurant" && (
            <InfoRow icon="silverware">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </InfoRow>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  bannerSubtitle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.85)",
  },
  bannerChip: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  bannerChipText: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  description: {
    color: "#3c3c43",
    flex: 1,
  },
  favoriteButton: {
    marginRight: -8,
    marginTop: -6,
  },
  infoGrid: {
    marginTop: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    color: "#475569",
  },
});

export default PlaceCard;
