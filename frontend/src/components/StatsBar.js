import React from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const mappings = [
  { key: "hotelCount", label: "Hotele", icon: "bed-king-outline", accent: "#6C63FF" },
  { key: "restaurantCount", label: "Restorante", icon: "silverware-fork-knife", accent: "#FF8F6C" },
  { key: "barCount", label: "Bare", icon: "glass-cocktail", accent: "#FB923C" },
  { key: "eventCount", label: "Evente", icon: "calendar-star", accent: "#42C6A5" },
  { key: "cityCount", label: "Qytete", icon: "city-variant-outline", accent: "#0EA5E9" },
];

const StatsBar = ({ stats }) => {
  return (
    <View style={styles.container}>
      {mappings.map((item) => (
        <Surface key={item.key} style={styles.surface} elevation={4}>
          <View style={[styles.iconPill, { backgroundColor: `${item.accent}22` }]}> 
            <MaterialCommunityIcons name={item.icon} size={24} color={item.accent} />
          </View>
          <Text variant="labelLarge" style={styles.label}>
            {item.label}
          </Text>
          <Text variant="headlineSmall" style={styles.value}>
            {stats?.[item.key] ?? 0}
          </Text>
        </Surface>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  surface: {
    flexBasis: "47%",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  iconPill: {
    padding: 8,
    borderRadius: 14,
    marginBottom: 12,
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: "700",
  },
});

export default StatsBar;
