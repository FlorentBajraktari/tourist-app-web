import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Searchbar, Surface, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import FilterChips from "../components/FilterChips";
import HeroHeader from "../components/HeroHeader";
import PlaceList from "../components/PlaceList";
import StatsBar from "../components/StatsBar";
import QuickActions from "../components/QuickActions";
import StatsBarCompact from "../components/StatsBarCompact";

const DiscoverScreen = ({
  data,
  stats,
  statsByCountry,
  loading,
  onRefresh,
  lastUpdated,
  onGlobalSelect,
  favoriteIds,
  onToggleFavorite,
  onOpenMap,
  onOpenCities,
  onOpenCountries,
  favorites = [],
  onOpenFavorites,
}) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    const list = filter === "all" ? data.combined : data.combined.filter((item) => item.kind === filter);
    if (!query) return list;
    const lower = query.toLowerCase();
    return list.filter((item) =>
      [item.name, item.description, item.location, item.city]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [data.combined, filter, query]);

  const renderHeader = () => (
    <View>
      <HeroHeader
        title="Discover the city"
        subtitle="Curated stays, dining, and experiences at your fingertips"
        onRefresh={onRefresh}
      />
      <StatsBar stats={stats} />
      <QuickActions
        onSelectFilter={(value) => setFilter(value)}
        onOpenMap={onOpenMap}
        onOpenCities={onOpenCities}
        onOpenCountries={onOpenCountries}
        onOpenFavorites={onOpenFavorites}
      />

      {favorites.length > 0 && (
        <Surface style={styles.favoritesSurface} elevation={3}>
          <LinearGradient colors={["#F97316", "#EF4444"]} start={[0, 0]} end={[1, 1]} style={styles.favoritesGradient}>
            <View style={styles.favoritesTextColumn}>
              <Text variant="titleMedium" style={styles.favoritesTitle}>
                Your saved gems
              </Text>
              <Text variant="bodySmall" style={styles.favoritesSubtitle}>
                {favorites.length === 1
                  ? `${favorites[0].name} është ruajtur për t'u parë më vonë`
                  : `Ke ${favorites.length} destinacione të preferuara ready for your next trip`}
              </Text>
              <Button
                mode="contained"
                compact
                onPress={onOpenFavorites}
                style={styles.favoritesButton}
                buttonColor="rgba(255,255,255,0.22)"
                textColor="#fff"
              >
                Shiko të preferuarat
              </Button>
            </View>
            <View style={styles.favoritesBubble}>
              <Text variant="titleLarge" style={styles.favoritesBubbleText}>
                {favorites
                  .slice(0, 2)
                  .map((item) => item.city || item.location || item.name)
                  .join(" \u2022 ")}
              </Text>
              <Text variant="bodySmall" style={styles.favoritesBubbleCaption}>
                Highlights to revisit
              </Text>
            </View>
          </LinearGradient>
        </Surface>
      )}

      <Surface style={styles.countrySurface} elevation={2}>
        <View style={styles.countryHeader}>
          <Text variant="titleMedium" style={styles.countryTitle}>
            Fokus kombëtar
          </Text>
          <Text variant="bodySmall" style={styles.countrySubtitle}>
            {stats.countryCount === 1
              ? "Eksploron një shtet"
              : `Eksploron ${stats.countryCount} shtete`}:
            {" "}
            {Object.entries(statsByCountry)
              .map(([country]) => country)
              .slice(0, 2)
              .join(" & ")}
          </Text>
        </View>
        <StatsBarCompact statsByCountry={statsByCountry} />
      </Surface>

      <Surface style={styles.searchSurface} elevation={2}>
        <Text variant="labelLarge" style={styles.searchLabel}>
          Search & filter
        </Text>
        <Searchbar
          placeholder="Try 'jazz', 'seaside', or 'breakfast'"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          inputStyle={styles.searchInput}
          iconColor="#4C6FFF"
          autoCorrect={false}
        />
        <FilterChips selected={filter} onSelect={setFilter} />
        {lastUpdated && (
          <Text variant="bodySmall" style={styles.timestamp}>
            Synced {lastUpdated.toLocaleTimeString()}
          </Text>
        )}
      </Surface>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PlaceList
        data={filteredData}
        loading={loading}
        onRefresh={onRefresh}
        onSelect={onGlobalSelect}
        favoriteIds={favoriteIds}
        onToggleFavorite={onToggleFavorite}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  searchSurface: {
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: "#fff",
    gap: 16,
  },
  searchLabel: {
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#94a3b8",
  },
  search: {
    backgroundColor: "#f3f6fb",
    elevation: 0,
  },
  searchInput: {
    fontSize: 15,
  },
  timestamp: {
    opacity: 0.6,
    textAlign: "right",
  },
  favoritesSurface: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
    overflow: "hidden",
  },
  favoritesGradient: {
    paddingVertical: 24,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  favoritesTextColumn: {
    flex: 1,
    gap: 10,
  },
  favoritesTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  favoritesSubtitle: {
    color: "rgba(255,255,255,0.8)",
  },
  favoritesButton: {
    alignSelf: "flex-start",
  },
  favoritesBubble: {
    backgroundColor: "rgba(15,23,42,0.25)",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    maxWidth: 150,
  },
  favoritesBubbleText: {
    color: "#fff",
    fontWeight: "700",
  },
  favoritesBubbleCaption: {
    marginTop: 6,
    color: "rgba(255,255,255,0.7)",
  },
});

export default DiscoverScreen;
