import Constants from "expo-constants";

const DEFAULT_TIMEOUT = 8000;
const API_URL = Constants.expoConfig?.extra?.apiUrl ?? "http://127.0.0.1:8000/api";

const fetchWithTimeout = (resource, options = {}) => {
  const { timeout = DEFAULT_TIMEOUT, ...rest } = options;
  return Promise.race([
    fetch(resource, rest),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
};

const normalizeResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (payload && typeof payload === "object" && Array.isArray(payload.results)) {
    return payload.results;
  }
  return payload;
};

export const getHotels = async () =>
  normalizeResponse(await fetchWithTimeout(`${API_URL}/hotels/`));

export const getRestaurants = async () =>
  normalizeResponse(await fetchWithTimeout(`${API_URL}/restaurants/`));

export const getEvents = async () =>
  normalizeResponse(await fetchWithTimeout(`${API_URL}/events/`));

export const getAllPlaces = async () => {
  const [hotels, restaurants, events] = await Promise.all([
    getHotels(),
    getRestaurants(),
    getEvents(),
  ]);
  return { hotels, restaurants, events };
};
