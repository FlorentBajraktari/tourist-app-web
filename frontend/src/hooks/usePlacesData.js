import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAllPlaces } from "../api";

const CACHE_KEY = "tourist-app-cache-v1";

const buildIndexedEntities = (hotels, restaurants, events) => ({
  hotels,
  restaurants,
  events,
  combined: [
    ...hotels.map((item) => ({ ...item, kind: "hotel" })),
    ...restaurants.map((item) => ({ ...item, kind: "restaurant" })),
    ...events.map((item) => ({ ...item, kind: "event" })),
  ],
});

export const usePlacesData = () => {
  const [data, setData] = useState(buildIndexedEntities([], [], []));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadFromCache = useCallback(async () => {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) return false;
    try {
      const parsed = JSON.parse(cached);
      if (parsed?.timestamp && parsed?.payload) {
        setData(parsed.payload);
        setLastUpdated(new Date(parsed.timestamp));
        return true;
      }
    } catch (err) {
      console.warn("Failed to parse cache", err);
    }
    return false;
  }, []);

  const persistCache = useCallback(async (payload) => {
    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: new Date().toISOString(), payload })
      );
    } catch (err) {
      console.warn("Failed to persist cache", err);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPlaces();
      const payload = buildIndexedEntities(
        response.hotels ?? [],
        response.restaurants ?? [],
        response.events ?? []
      );
      setData(payload);
      setLastUpdated(new Date());
      persistCache(payload);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [persistCache]);

  useEffect(() => {
    (async () => {
      const hadCache = await loadFromCache();
      await refresh();
      if (!hadCache) setLoading(false);
    })();
  }, [loadFromCache, refresh]);

  const stats = useMemo(() => {
    const barCount = data.restaurants.filter(
      (item) => (item.category ?? "").toLowerCase() === "bar"
    ).length;
    const cityCount = new Set(
      data.combined
        .map((item) => item.city || item.location)
        .filter(Boolean)
    ).size;
    const countryCount = new Set(
      data.combined
        .map((item) => item.country)
        .filter(Boolean)
    ).size;

    return {
      hotelCount: data.hotels.length,
      restaurantCount: data.restaurants.length,
      barCount,
      eventCount: data.events.length,
      cityCount,
      countryCount,
    };
  }, [data]);

  const statsByCountry = useMemo(() => {
    const ensure = (collection, country) => {
      if (!collection[country]) {
        collection[country] = {
          hotelCount: 0,
          restaurantCount: 0,
          barCount: 0,
          eventCount: 0,
          citySet: new Set(),
        };
      }
      return collection[country];
    };

    const accumulator = {};

    data.hotels.forEach((item) => {
      const bucket = ensure(accumulator, item.country ?? "Të tjera");
      bucket.hotelCount += 1;
      if (item.city) bucket.citySet.add(item.city);
    });

    data.restaurants.forEach((item) => {
      const bucket = ensure(accumulator, item.country ?? "Të tjera");
      const category = (item.category ?? "restaurant").toLowerCase();
      if (category === "bar") {
        bucket.barCount += 1;
      } else {
        bucket.restaurantCount += 1;
      }
      if (item.city) bucket.citySet.add(item.city);
    });

    data.events.forEach((item) => {
      const bucket = ensure(accumulator, item.country ?? "Të tjera");
      bucket.eventCount += 1;
      if (item.city) bucket.citySet.add(item.city);
    });

    return Object.entries(accumulator).reduce((map, [country, bucket]) => {
      map[country] = {
        hotelCount: bucket.hotelCount,
        restaurantCount: bucket.restaurantCount,
        barCount: bucket.barCount,
        eventCount: bucket.eventCount,
        cityCount: bucket.citySet.size,
      };
      return map;
    }, {});
  }, [data]);

  const countries = useMemo(() => Object.keys(statsByCountry).sort(), [statsByCountry]);

  return {
    data,
    stats,
    statsByCountry,
    countries,
    loading,
    error,
    refresh,
    lastUpdated,
  };
};
