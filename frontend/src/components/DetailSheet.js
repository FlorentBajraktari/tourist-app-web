import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Modal, Portal, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const gradients = {
  hotel: ["#5B7FFF", "#A178FF"],
  restaurant: ["#FF8566", "#FFB347"],
  event: ["#51D3A3", "#37B9E9"],
  default: ["#6E7CFF", "#9C5DFF"],
};

const DetailSheet = ({ item, visible, onDismiss, isFavorite = false, onToggleFavorite }) => {
  if (!item) return null;
  const colors = gradients[item.kind] ?? gradients.default;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <LinearGradient colors={colors} start={[0, 0]} end={[1, 1]} style={styles.hero}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name={item.kind === "hotel" ? "bed" : item.kind === "restaurant" ? "silverware-variant" : "calendar-check"}
              size={32}
              color="#fff"
            />
          </View>
          <Text variant="headlineMedium" style={styles.heroTitle}>
            {item.name}
          </Text>
          <Text variant="bodyMedium" style={styles.heroSub}>
            {item.location || item.kind?.toUpperCase()}
          </Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="bodyLarge" style={styles.description}>
            {item.description}
          </Text>

          <View style={styles.metaRow}>
            {item.price_per_night && (
              <Chip icon="currency-eur" style={styles.metaChip}>
                €{item.price_per_night} / night
              </Chip>
            )}
            {item.rating && (
              <Chip icon="star" style={styles.metaChip}>
                Rating {item.rating}
              </Chip>
            )}
            {item.date && (
              <Chip icon="calendar" style={styles.metaChip}>
                {item.date}
              </Chip>
            )}
            {item.opening_hours && (
              <Chip icon="clock-outline" style={styles.metaChip}>
                {item.opening_hours}
              </Chip>
            )}
          </View>
        </ScrollView>
        <View style={styles.actions}>
          <Button
            mode={isFavorite ? "contained" : "outlined"}
            icon={isFavorite ? "heart" : "heart-outline"}
            onPress={() => onToggleFavorite?.(item)}
            style={styles.favoriteButton}
          >
            {isFavorite ? "Në të preferuarat" : "Ruaj si të preferuar"}
          </Button>
          <Button mode="contained" onPress={onDismiss} style={styles.closeButton}>
            Mbyll
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 16,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  heroSub: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 14,
  },
  description: {
    color: "#333",
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaChip: {
    backgroundColor: "#f1f3fb",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  favoriteButton: {
    flex: 1,
  },
  closeButton: {
    flex: 1,
  },
});

export default DetailSheet;
