import React from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ACTIONS = [
  { key: "hotels", label: "Hotele", icon: "bed", gradient: ["#4C7CFF", "#70A1FF"], filter: "hotel" },
  {
    key: "restaurants",
    label: "Gastronomi",
    icon: "silverware-fork-knife",
    gradient: ["#FF7C5C", "#FFB061"],
    filter: "restaurant",
  },
  {
    key: "events",
    label: "Evente",
    icon: "calendar-star",
    gradient: ["#38CDA4", "#1D9DE6"],
    filter: "event",
  },
  {
    key: "favorites",
    label: "Të preferuarat",
    icon: "heart",
    gradient: ["#EF4444", "#F97316"],
    action: "favorites",
  },
  {
    key: "cities",
    label: "Qytete",
    icon: "city-variant-outline",
    gradient: ["#38BDF8", "#0EA5E9"],
    action: "cities",
  },
  { key: "map", label: "Hartë", icon: "map-search", gradient: ["#6E7CFF", "#A471FF"], action: "map" },
];

const QuickActions = ({ onSelectFilter, onOpenMap, onOpenCities, onOpenFavorites }) => {
  return (
    <View style={styles.wrapper}>
      {ACTIONS.map((item) => (
        <Surface style={styles.surface} key={item.key} elevation={3}>
          <TouchableRipple
            style={styles.touchable}
            borderless
            rippleColor="rgba(255,255,255,0.3)"
            onPress={() => {
              if (item.action === "map") {
                onOpenMap?.();
              } else if (item.action === "cities") {
                onOpenCities?.();
              } else if (item.action === "favorites") {
                onOpenFavorites?.();
              } else {
                onSelectFilter?.(item.filter);
              }
            }}
          >
            <LinearGradient colors={item.gradient} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
              <MaterialCommunityIcons name={item.icon} size={26} color="#fff" />
              <Text variant="titleSmall" style={styles.label}>
                {item.label}
              </Text>
            </LinearGradient>
          </TouchableRipple>
        </Surface>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  surface: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
  },
  label: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default QuickActions;
