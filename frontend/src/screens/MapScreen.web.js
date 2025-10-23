import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const MapScreen = ({ onSelect }) => (
  <View style={styles.container}>
    <Text variant="headlineMedium" style={styles.title}>
      Harta mobile nuk mbështetet në shfletues
    </Text>
    <Text variant="bodyMedium" style={styles.body}>
      Hapni aplikacionin në një pajisje mobile për të eksploruar pikët interaktive në hartë.
    </Text>
    <Button mode="contained" onPress={() => onSelect?.(null)} style={styles.button}>
      Kthehu te listat
    </Button>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#f3f6fb",
    gap: 16,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    color: "#0f172a",
    maxWidth: 420,
  },
  button: {
    marginTop: 8,
  },
});

export default MapScreen;
