import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HeroHeader = ({ title, subtitle, onRefresh }) => {
  return (
    <LinearGradient colors={["#2B58F9", "#6D24FF"]} start={[0, 0]} end={[1, 1]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text variant="headlineLarge" style={styles.title}>
            {title}
          </Text>
          {!!subtitle && (
            <Text variant="bodyLarge" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        {onRefresh && (
          <IconButton
            icon={() => <MaterialCommunityIcons name="refresh" size={28} color="#fff" />}
            size={36}
            mode="contained"
            containerColor="rgba(255,255,255,0.18)"
            onPress={onRefresh}
            accessibilityLabel="Refresh data"
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 28,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 6,
    shadowColor: "#0a1c60",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 8,
  },
});

export default HeroHeader;
