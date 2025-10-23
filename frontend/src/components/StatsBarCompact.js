import React from "react";
import { StyleSheet, View } from "react-native";
import { ProgressBar, Text } from "react-native-paper";

const palette = ["#0EA5E9", "#38BDF8", "#818CF8", "#F97316", "#FACC15"];

const StatsBarCompact = ({ statsByCountry }) => {
  const entries = Object.entries(statsByCountry ?? {});
  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text variant="bodySmall" style={styles.emptyText}>
          Nuk ka të dhëna për t'u shfaqur ende.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {entries.map(([country, stats], index) => {
        const total = stats.hotelCount + stats.restaurantCount + stats.barCount + stats.eventCount;
        const color = palette[index % palette.length];
        return (
          <View key={country} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text variant="labelLarge" style={styles.countryLabel}>
                {country}
              </Text>
              <Text variant="bodySmall" style={styles.countryCaption}>
                {stats.cityCount} qytete · {total} pika
              </Text>
            </View>
            <ProgressBar progress={total > 0 ? Math.min(total / 12, 1) : 0} color={color} style={styles.progress} />
            <View style={styles.metrics}>
              <Text variant="bodySmall" style={styles.metric}>
                {stats.hotelCount} hotele
              </Text>
              <Text variant="bodySmall" style={styles.metric}>
                {stats.restaurantCount} ushqim
              </Text>
              <Text variant="bodySmall" style={styles.metric}>
                {stats.barCount} bare
              </Text>
              <Text variant="bodySmall" style={styles.metric}>
                {stats.eventCount} evente
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
  },
  row: {
    gap: 10,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countryLabel: {
    fontWeight: "700",
    color: "#1e293b",
  },
  countryCaption: {
    color: "#64748b",
  },
  progress: {
    height: 8,
    borderRadius: 999,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metric: {
    color: "#475569",
  },
  empty: {
    paddingVertical: 12,
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
  },
});

export default StatsBarCompact;
