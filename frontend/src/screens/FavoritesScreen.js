import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Surface, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import FilterChips from "../components/FilterChips";
import PlaceCard from "../components/PlaceCard";

const favoriteKey = (item) => `${item.kind}-${item.id}`;

const buildSummary = (favorites) => {
  const summary = {
    total: favorites.length,
    hotel: 0,
    restaurant: 0,
    event: 0,
    topCity: null,
  };

  const cityAccumulator = new Map();

  favorites.forEach((item) => {
    if (summary[item.kind] !== undefined) {
      summary[item.kind] += 1;
    }
    if (item.city) {
      cityAccumulator.set(item.city, (cityAccumulator.get(item.city) ?? 0) + 1);
    }
  });

  const [topCity] = Array.from(cityAccumulator.entries()).sort((a, b) => b[1] - a[1]);
  summary.topCity = topCity?.[0] ?? null;

  return summary;
};

const FavoritesScreen = ({
  favorites = [],
  favoriteIds,
  onSelect,
  onToggleFavorite,
  onClearFavorites,
  onExplore = () => {},
}) => {
  const [filter, setFilter] = useState("all");

  const summary = useMemo(() => buildSummary(favorites), [favorites]);

  const filteredFavorites = useMemo(() => {
    if (filter === "all") return favorites;
    return favorites.filter((item) => item.kind === filter);
  }, [favorites, filter]);

  const highlight = useMemo(() => {
    if (favorites.length === 0) return null;
    const rated = favorites
      .filter((item) => item.rating)
      .sort((a, b) => parseFloat(b.rating ?? 0) - parseFloat(a.rating ?? 0));
    return rated[0] ?? favorites[0];
  }, [favorites]);

  const statPills = useMemo(
    () => [
      { label: "Hotele", value: summary.hotel },
      { label: "Gastronomi", value: summary.restaurant },
      { label: "Evente", value: summary.event },
    ],
    [summary.event, summary.hotel, summary.restaurant],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.heroSurface} elevation={0}>
          <LinearGradient colors={["#EF4444", "#F97316"]} start={[0, 0]} end={[1, 1]} style={styles.heroGradient}>
            <View style={styles.heroHeader}>
              <Text variant="labelLarge" style={styles.heroTag}>
                Koleksioni yt i personalizuar
              </Text>
              <Chip icon="heart" mode="flat" textStyle={styles.heroChipText} style={styles.heroChip}>
                {summary.total} të ruajtura
              </Chip>
            </View>
            <Text variant="headlineMedium" style={styles.heroTitle}>
              Destinacionet e tua të preferuara
            </Text>
            <Text variant="bodyMedium" style={styles.heroSubtitle}>
              {summary.total === 0
                ? "Ruaj hotele, restorante dhe evente ndërsa eksploron Discover për t'i parë këtu."
                : `Po ruan ${summary.hotel} hotele, ${summary.restaurant} gastronomi dhe ${summary.event} evente${
                    summary.topCity ? ` · ${summary.topCity} kryeson listën tënde` : ""
                  }.`}
            </Text>

            <View style={styles.heroStats}>
              {statPills.map((pill) => (
                <View key={pill.label} style={styles.heroStatPill}>
                  <Text variant="titleMedium" style={styles.heroStatValue}>
                    {pill.value}
                  </Text>
                  <Text variant="bodySmall" style={styles.heroStatLabel}>
                    {pill.label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.heroActions}>
              <Button
                mode="contained"
                icon="compass"
                onPress={onExplore}
                buttonColor="rgba(255,255,255,0.22)"
                textColor="#fff"
              >
                Eksploro më shumë
              </Button>
              {summary.total > 0 && (
                <Button mode="text" textColor="#fff" icon="trash-can" onPress={onClearFavorites}>
                  Fshij listën
                </Button>
              )}
            </View>
          </LinearGradient>
        </Surface>

        {highlight && (
          <Surface style={styles.highlightSurface} elevation={3}>
            <Text variant="titleMedium" style={styles.highlightTitle}>
              Highlight i ditës
            </Text>
            <Text variant="bodySmall" style={styles.highlightSubtitle}>
              Bazuar në rating dhe cilësinë e përvojës së ruajtur.
            </Text>
            <PlaceCard
              item={highlight}
              onPress={() => onSelect?.(highlight)}
              isFavorite={favoriteIds?.has(favoriteKey(highlight))}
              onToggleFavorite={onToggleFavorite}
            />
          </Surface>
        )}

        <Surface style={styles.controlsSurface} elevation={2}>
          <Text variant="titleMedium" style={styles.controlsTitle}>
            Filtro listën tënde
          </Text>
          <FilterChips selected={filter} onSelect={setFilter} />
        </Surface>

        {filteredFavorites.length === 0 ? (
          <Surface style={styles.emptyState} elevation={1}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Lista është bosh
            </Text>
            <Text variant="bodySmall" style={styles.emptyBody}>
              Ruaj destinacione ndërsa eksploron Discover për t'i parë këtu.
            </Text>
            <Button mode="contained" onPress={onExplore}>
              Kthehu te Discover
            </Button>
          </Surface>
        ) : (
          <View style={styles.cardsSection}>
            {filteredFavorites.map((item) => (
              <PlaceCard
                key={favoriteKey(item)}
                item={item}
                onPress={() => onSelect?.(item)}
                isFavorite={favoriteIds?.has(favoriteKey(item))}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  content: {
    paddingBottom: 64,
  },
  heroSurface: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 28,
    overflow: "hidden",
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 16,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTag: {
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  heroChip: {
    backgroundColor: "rgba(15,23,42,0.25)",
  },
  heroChipText: {
    color: "#fff",
    fontWeight: "600",
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "700",
    lineHeight: 30,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
  },
  heroStats: {
    flexDirection: "row",
    gap: 12,
  },
  heroStatPill: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.25)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  heroStatValue: {
    color: "#fff",
    fontWeight: "700",
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.75)",
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
  },
  highlightSurface: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#fff",
    gap: 10,
  },
  highlightTitle: {
    color: "#0f172a",
    fontWeight: "700",
  },
  highlightSubtitle: {
    color: "#64748b",
  },
  controlsSurface: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    gap: 16,
  },
  controlsTitle: {
    color: "#0f172a",
    fontWeight: "600",
  },
  cardsSection: {
    marginTop: 8,
    paddingBottom: 32,
  },
  emptyState: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#fff",
    gap: 12,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#0f172a",
    fontWeight: "600",
  },
  emptyBody: {
    color: "#64748b",
    textAlign: "center",
  },
});

export default FavoritesScreen;
