import "react-native-gesture-handler";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Button,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DetailSheet from "./src/components/DetailSheet";
import { usePlacesData } from "./src/hooks/usePlacesData";
import DiscoverScreen from "./src/screens/DiscoverScreen";
import CitiesScreen from "./src/screens/CitiesScreen";
import CountriesScreen from "./src/screens/CountriesScreen";
import MapScreen from "./src/screens/MapScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";

const Tab = createBottomTabNavigator();

const FAVORITES_STORAGE_KEY = "tourist-app-favorites-v1";

const paperTheme = {
  ...PaperDefaultTheme,
  roundness: 18,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: "#0052cc",
    secondary: "#ff8c42",
    surface: "#ffffff",
    background: "#f3f6fb",
  },
  animation: {
    scale: 1.05,
  },
};

const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: paperTheme.colors.primary,
    background: "#f3f6fb",
  },
};

const iconForRoute = {
  Discover: "compass-outline",
  Cities: "city-variant-outline",
  Countries: "earth",
  Favorites: "heart",
  Map: "map-marker-radius",
};

const LoadingView = () => (
  <View style={styles.centered}>
    <ActivityIndicator animating size="large" />
    <Text style={styles.loadingText} variant="bodyMedium">
      Fetching city highlights…
    </Text>
  </View>
);

const ErrorView = ({ error, onRetry }) => (
  <View style={styles.centered}>
    <Text variant="titleMedium" style={styles.errorTitle}>
      Something went wrong
    </Text>
    <Text variant="bodyMedium" style={styles.errorBody}>
      {error.message ?? "Unable to load data"}
    </Text>
    <Button mode="contained" onPress={onRetry} style={styles.retryButton}>
      Try again
    </Button>
  </View>
);

function App() {
  const { data, stats, statsByCountry, countries, loading, error, refresh, lastUpdated } = usePlacesData();
  const [selected, setSelected] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [favoritesHydrated, setFavoritesHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavoriteIds(new Set(parsed));
          }
        }
      } catch (err) {
        console.warn("Failed to load favorites", err);
      } finally {
        setFavoritesHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!favoritesHydrated) return;
    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteIds))).catch((err) =>
      console.warn("Failed to persist favorites", err)
    );
  }, [favoriteIds, favoritesHydrated]);

  const handleToggleFavorite = (item) => {
    const key = `${item.kind}-${item.id}`;
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleClearFavorites = useCallback(() => {
    setFavoriteIds(() => new Set());
  }, []);

  const favoriteItems = useMemo(
    () => data.combined.filter((item) => favoriteIds.has(`${item.kind}-${item.id}`)),
    [data.combined, favoriteIds]
  );

  const selectedKey = selected ? `${selected.kind}-${selected.id}` : null;
  const selectedIsFavorite = selectedKey ? favoriteIds.has(selectedKey) : false;

  const isInitialLoading = loading && data.combined.length === 0;
  const fatalError = error && data.combined.length === 0;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          {fatalError ? (
            <ErrorView error={error} onRetry={refresh} />
          ) : isInitialLoading ? (
            <LoadingView />
          ) : (
            <>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  headerShown: false,
                  tabBarActiveTintColor: paperTheme.colors.primary,
                  tabBarInactiveTintColor: "#777",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name={iconForRoute[route.name] ?? "map-marker"}
                      size={size}
                      color={color}
                    />
                  ),
                })}
              >
                <Tab.Screen name="Discover">
                  {({ navigation }) => (
                    <DiscoverScreen
                      data={data}
                      stats={stats}
                      statsByCountry={statsByCountry}
                      loading={loading}
                      onRefresh={refresh}
                      lastUpdated={lastUpdated}
                      onGlobalSelect={setSelected}
                      favoriteIds={favoriteIds}
                      onToggleFavorite={handleToggleFavorite}
                      favorites={favoriteItems}
                      onOpenMap={() => navigation.navigate("Map")}
                      onOpenCities={() => navigation.navigate("Cities")}
                      onOpenCountries={() => navigation.navigate("Countries")}
                      onOpenFavorites={() => navigation.navigate("Favorites")}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="Cities">
                  {() => (
                    <CitiesScreen
                      data={data}
                      onGlobalSelect={setSelected}
                      favoriteIds={favoriteIds}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="Countries">
                  {() => (
                    <CountriesScreen
                      data={data}
                      statsByCountry={statsByCountry}
                      countries={countries}
                      favoriteIds={favoriteIds}
                      onToggleFavorite={handleToggleFavorite}
                      onGlobalSelect={setSelected}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="Favorites">
                  {({ navigation }) => (
                    <FavoritesScreen
                      favorites={favoriteItems}
                      favoriteIds={favoriteIds}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={setSelected}
                      onClearFavorites={handleClearFavorites}
                      onExplore={() => navigation.navigate("Discover")}
                    />
                  )}
                </Tab.Screen>
                <Tab.Screen name="Map">
                  {() => <MapScreen combined={data.combined} onSelect={setSelected} />}
                </Tab.Screen>
              </Tab.Navigator>
              <DetailSheet
                item={selected}
                visible={!!selected}
                onDismiss={() => setSelected(null)}
                isFavorite={selectedIsFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            </>
          )}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f3f6fb",
  },
  loadingText: {
    marginTop: 12,
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  errorBody: {
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
});

export default App;
