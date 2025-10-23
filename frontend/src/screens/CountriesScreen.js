import React, { useMemo, useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, View } from "react-native";
import { Chip, Surface, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import PlaceCard from "../components/PlaceCard";
import StatsBarCompact from "../components/StatsBarCompact";

const favoriteKey = (item) => `${item.kind}-${item.id}`;

const buildCountryMap = (data) => {
  const map = new Map();

  data.combined.forEach((item) => {
    const country = item.country || "Të tjera";
    if (!map.has(country)) {
      map.set(country, {
        country,
        hotels: [],
        restaurants: [],
        bars: [],
        events: [],
        cities: new Set(),
      });
    }
    const bucket = map.get(country);
    if (item.city) bucket.cities.add(item.city);

    if (item.kind === "hotel") {
      bucket.hotels.push(item);
    } else if (item.kind === "restaurant") {
      const category = (item.category ?? "restaurant").toLowerCase();
      if (category === "bar") {
        bucket.bars.push(item);
      } else {
        bucket.restaurants.push(item);
      }
    } else if (item.kind === "event") {
      bucket.events.push(item);
    }
  });

  return Array.from(map.values()).map((bucket) => ({
    ...bucket,
    cityCount: bucket.cities.size,
  }));
};

const CountriesScreen = ({ data, statsByCountry, countries, favoriteIds, onToggleFavorite, onGlobalSelect }) => {
  const countryEntries = useMemo(() => buildCountryMap(data), [data]);
  const [activeCountry, setActiveCountry] = useState(countries?.[0] ?? countryEntries[0]?.country ?? "Kosovë");

  const activeEntry = useMemo(() => countryEntries.find((entry) => entry.country === activeCountry), [
    countryEntries,
    activeCountry,
  ]);

  const favoriteLookup = favoriteIds ?? new Set();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.hero} elevation={0}>
          <LinearGradient colors={["#0f172a", "#1e3a8a"]} start={[0, 0]} end={[1, 1]} style={styles.heroGradient}>
            <Text variant="labelLarge" style={styles.heroChip}>
              Gati për udhëtim ballkanik
            </Text>
            <Text variant="headlineMedium" style={styles.heroTitle}>
              Turizëm i kuruar për Kosovën dhe Shqipërinë
            </Text>
            <Text variant="bodyMedium" style={styles.heroSubtitle}>
              Zgjidh një shtet për të parë qytetet, hotelet, gastronominë dhe eventet kryesore.
            </Text>
          </LinearGradient>
        </Surface>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {countryEntries.map((entry) => (
            <Chip
              key={entry.country}
              selected={entry.country === activeCountry}
              onPress={() => setActiveCountry(entry.country)}
              style={styles.filterChip}
              mode="outlined"
            >
              {entry.country} · {entry.cityCount} qytete
            </Chip>
          ))}
        </ScrollView>

        <Surface style={styles.summaryCard} elevation={2}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Përmbledhje sipas shteteve
          </Text>
          <Text variant="bodySmall" style={styles.summaryCaption}>
            Krahaso potencialin turistik dhe shumën e destinacioneve kryesore në secilin shtet.
          </Text>
          <StatsBarCompact statsByCountry={statsByCountry} />
        </Surface>

        {activeEntry ? (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionHeading}>
              {activeEntry.country}
            </Text>
            <Text variant="bodySmall" style={styles.sectionDescription}>
              {activeEntry.cityCount} qytete · {activeEntry.hotels.length + activeEntry.restaurants.length + activeEntry.bars.length} pika mikpritjeje · {activeEntry.events.length} evente
            </Text>

            <View style={styles.cardSection}>
              {activeEntry.hotels.map((item) => (
                <PlaceCard
                  key={favoriteKey(item)}
                  item={item}
                  onPress={() => onGlobalSelect(item)}
                  isFavorite={favoriteLookup.has(favoriteKey(item))}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
              {activeEntry.restaurants.map((item) => (
                <PlaceCard
                  key={favoriteKey(item)}
                  item={item}
                  onPress={() => onGlobalSelect(item)}
                  isFavorite={favoriteLookup.has(favoriteKey(item))}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
              {activeEntry.bars.map((item) => (
                <PlaceCard
                  key={favoriteKey(item)}
                  item={item}
                  onPress={() => onGlobalSelect(item)}
                  isFavorite={favoriteLookup.has(favoriteKey(item))}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </View>

            <View style={styles.eventSection}>
              <Text variant="titleMedium" style={styles.eventTitle}>
                Evente që po vijnë
              </Text>
              {activeEntry.events.map((item) => (
                <PlaceCard
                  key={favoriteKey(item)}
                  item={item}
                  onPress={() => onGlobalSelect(item)}
                  isFavorite={favoriteLookup.has(favoriteKey(item))}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </View>
          </View>
        ) : (
          <Surface style={styles.emptyState} elevation={1}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Aktualisht nuk ka të dhëna për këtë shtet
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtitle}>
              Rifresko ose kontrollo më vonë për destinacione të reja.
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
    paddingBottom: 64,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 20,
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
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "700",
    lineHeight: 32,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    gap: 12,
  },
  filterChip: {
    marginRight: 12,
    backgroundColor: "#fff",
  },
  summaryCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 18,
    backgroundColor: "#fff",
    gap: 12,
  },
  summaryTitle: {
    fontWeight: "700",
    color: "#0f172a",
  },
  summaryCaption: {
    color: "#64748b",
  },
  section: {
    marginTop: 24,
    gap: 16,
  },
  sectionHeading: {
    marginHorizontal: 16,
    color: "#0f172a",
    fontWeight: "700",
  },
  sectionDescription: {
    marginHorizontal: 16,
    color: "#64748b",
  },
  cardSection: {
    gap: 12,
  },
  eventSection: {
    gap: 12,
    marginBottom: 24,
  },
  eventTitle: {
    marginHorizontal: 16,
    color: "#0f172a",
    fontWeight: "600",
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
  emptySubtitle: {
    textAlign: "center",
    color: "#64748b",
  },
});

export default CountriesScreen;
