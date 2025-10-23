import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Surface, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import PlaceCard from "../components/PlaceCard";

const favoriteKey = (item) => `${item.kind}-${item.id}`;

const buildCityEntries = (data) => {
  const cityMap = new Map();

  data.combined.forEach((item) => {
    const city = item.city || item.location || "Të tjera";
    if (!cityMap.has(city)) {
      cityMap.set(city, {
        city,
        hotels: [],
        restaurants: [],
        bars: [],
        events: [],
        centerAggregator: { lat: 0, lon: 0, count: 0 },
      });
    }

    const entry = cityMap.get(city);
    if (item.latitude && item.longitude) {
      entry.centerAggregator.lat += parseFloat(item.latitude);
      entry.centerAggregator.lon += parseFloat(item.longitude);
      entry.centerAggregator.count += 1;
    }

    if (item.kind === "hotel") {
      entry.hotels.push(item);
    } else if (item.kind === "restaurant") {
      const category = (item.category ?? "restaurant").toLowerCase();
      if (category === "bar") {
        entry.bars.push(item);
      } else {
        entry.restaurants.push(item);
      }
    } else if (item.kind === "event") {
      entry.events.push(item);
    }
  });

  return Array.from(cityMap.values())
    .map((entry) => {
      const { count, lat, lon } = entry.centerAggregator;
      entry.hotels.sort((a, b) => parseFloat(b.rating ?? 0) - parseFloat(a.rating ?? 0));
      entry.restaurants.sort((a, b) => parseFloat(b.rating ?? 0) - parseFloat(a.rating ?? 0));
      entry.bars.sort((a, b) => parseFloat(b.rating ?? 0) - parseFloat(a.rating ?? 0));
      entry.events.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(a.date) - new Date(b.date);
      });

      const venues = [...entry.hotels, ...entry.restaurants, ...entry.bars];
      const highlight = venues
        .filter((venue) => venue.rating)
        .sort((a, b) => parseFloat(b.rating ?? 0) - parseFloat(a.rating ?? 0))[0];

      return {
        ...entry,
        stats: {
          hotels: entry.hotels.length,
          dining: entry.restaurants.length,
          bars: entry.bars.length,
          events: entry.events.length,
          total: venues.length,
        },
        highlight: highlight ?? venues[0] ?? entry.events[0] ?? null,
        center:
          count > 0
            ? {
                latitude: lat / count,
                longitude: lon / count,
              }
            : null,
      };
    })
    .sort((a, b) => a.city.localeCompare(b.city));
};

const CitySection = ({ title, description, data, favoriteIds, onSelect, onToggleFavorite }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const favoriteLookup = favoriteIds ?? new Set();

  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      {description && (
        <Text variant="bodySmall" style={styles.sectionDescription}>
          {description}
        </Text>
      )}
      {data.map((item) => (
        <PlaceCard
          key={`${item.kind}-${item.id}`}
          item={item}
          onPress={() => onSelect(item)}
          isFavorite={favoriteLookup.has(favoriteKey(item))}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </View>
  );
};

const CitiesScreen = ({ data, onGlobalSelect, favoriteIds, onToggleFavorite }) => {
  const cityEntries = useMemo(() => buildCityEntries(data), [data]);
  const [selectedCity, setSelectedCity] = useState(() => cityEntries[0]?.city ?? null);

  useEffect(() => {
    if (!selectedCity && cityEntries.length > 0) {
      setSelectedCity(cityEntries[0].city);
    } else if (selectedCity && !cityEntries.find((entry) => entry.city === selectedCity)) {
      setSelectedCity(cityEntries[0]?.city ?? null);
    }
  }, [cityEntries, selectedCity]);

  const activeEntry = cityEntries.find((entry) => entry.city === selectedCity) ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.hero} elevation={0}>
          <LinearGradient colors={["#0f172a", "#312e81"]} start={[0, 0]} end={[1, 1]} style={styles.heroGradient}>
            <Text variant="labelLarge" style={styles.heroChip}>
              Eksploro Kosovën
            </Text>
            <Text variant="headlineMedium" style={styles.heroTitle}>
              Qytete plot jetë, shije dhe përvoja lokale
            </Text>
            {activeEntry?.highlight ? (
              <Text variant="bodyMedium" style={styles.heroSubtitle}>
                {activeEntry.city}: rekomandimi i ditës është {activeEntry.highlight.name}
              </Text>
            ) : (
              <Text variant="bodyMedium" style={styles.heroSubtitle}>
                Zgjidh një qytet për të parë hotel, restorante, bare dhe evente.
              </Text>
            )}
          </LinearGradient>
        </Surface>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityPills}
        >
          {cityEntries.map((entry) => (
            <Chip
              key={entry.city}
              selected={entry.city === activeEntry?.city}
              onPress={() => setSelectedCity(entry.city)}
              style={styles.cityChip}
              mode="outlined"
            >
              {entry.city} · {entry.stats.total + entry.stats.events}
            </Chip>
          ))}
        </ScrollView>

        {activeEntry ? (
          <View style={styles.statsSurface}>
            <Surface style={styles.statCard} elevation={2}>
              <Text variant="labelLarge" style={styles.statLabel}>
                Hotele
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {activeEntry.stats.hotels}
              </Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text variant="labelLarge" style={styles.statLabel}>
                Gastronomi
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {activeEntry.stats.restaurants}
              </Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text variant="labelLarge" style={styles.statLabel}>
                Bare
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {activeEntry.stats.bars}
              </Text>
            </Surface>
            <Surface style={styles.statCard} elevation={2}>
              <Text variant="labelLarge" style={styles.statLabel}>
                Evente
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {activeEntry.stats.events}
              </Text>
            </Surface>
          </View>
        ) : null}

        {activeEntry ? (
          <>
            <CitySection
              title="Hotelet e përzgjedhura"
              description="Qëndrime të rehatshme për eksplorime urbane dhe natyrore."
              data={activeEntry.hotels}
              favoriteIds={favoriteIds}
              onSelect={onGlobalSelect}
              onToggleFavorite={onToggleFavorite}
            />
            <CitySection
              title="Eksperienca gastronomike"
              description="Restorante dhe kafene që sjellin shije lokale dhe ndërkombëtare."
              data={activeEntry.restaurants}
              favoriteIds={favoriteIds}
              onSelect={onGlobalSelect}
              onToggleFavorite={onToggleFavorite}
            />
            <CitySection
              title="Bare & life-night"
              description="Atmosferë e gjallë, muzikë e mirë dhe kokteje artizanale."
              data={activeEntry.bars}
              favoriteIds={favoriteIds}
              onSelect={onGlobalSelect}
              onToggleFavorite={onToggleFavorite}
            />
            <CitySection
              title="Evente në kalendar"
              description="Festivale, ture dhe aktivitete që nuk duhen humbur."
              data={activeEntry.events}
              favoriteIds={favoriteIds}
              onSelect={onGlobalSelect}
              onToggleFavorite={onToggleFavorite}
            />
          </>
        ) : (
          <Surface style={styles.emptyState} elevation={1}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Nuk ka të dhëna për këtë qytet ende
            </Text>
            <Text variant="bodySmall" style={styles.emptyBody}>
              Rifresko për të parë nëse ka përditësime të reja nga ekipi lokal.
            </Text>
          </Surface>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    paddingBottom: 48,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 28,
    overflow: "hidden",
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 14,
  },
  heroChip: {
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "700",
    lineHeight: 32,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
  },
  cityPills: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
    gap: 12,
  },
  cityChip: {
    marginRight: 12,
    backgroundColor: "#fff",
  },
  statsSurface: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 18,
  },
  statCard: {
    flexBasis: "48%",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  statLabel: {
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    marginTop: 6,
    color: "#0f172a",
    fontWeight: "700",
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 16,
    color: "#0f172a",
    fontWeight: "700",
  },
  sectionDescription: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 4,
    color: "#64748b",
  },
  emptyState: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#fff",
    gap: 8,
  },
  emptyTitle: {
    textAlign: "center",
    color: "#0f172a",
    fontWeight: "600",
  },
  emptyBody: {
    textAlign: "center",
    color: "#64748b",
  },
});

export default CitiesScreen;
