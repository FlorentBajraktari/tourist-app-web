import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FILTERS = [
  { key: "all", label: "All", icon: "globe-model" },
  { key: "hotel", label: "Hotels", icon: "bed" },
  { key: "restaurant", label: "Dining", icon: "silverware-fork-knife" },
  { key: "event", label: "Events", icon: "calendar-star" },
];

const FilterChips = ({ selected = "all", onSelect, dense = false }) => {
  return (
    <View style={[styles.container, dense && styles.containerDense]}>
      {FILTERS.map((filter) => {
        const isActive = selected === filter.key;
        return (
          <Chip
            key={filter.key}
            icon={() => <MaterialCommunityIcons name={filter.icon} size={18} color={isActive ? "#fff" : "#64748b"} />}
            mode={isActive ? "flat" : "outlined"}
            selected={isActive}
            onPress={() => onSelect(filter.key)}
            style={[styles.chip, isActive && styles.chipActive]}
            textStyle={[styles.chipText, isActive && styles.chipTextActive]}
          >
            {filter.label}
          </Chip>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
  },
  containerDense: {
    paddingHorizontal: 0,
  },
  chip: {
    borderRadius: 16,
    borderColor: "#d0d7ff",
    backgroundColor: "#f8f9ff",
  },
  chipActive: {
    backgroundColor: "#4C6FFF",
  },
  chipText: {
    color: "#475569",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#fff",
  },
});

export default FilterChips;
