import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Text } from "react-native-paper";

import PlaceCard from "./PlaceCard";

const EmptyState = ({ message }) => (
  <View style={{ padding: 24 }}>
    <Text variant="bodyMedium" style={{ textAlign: "center", opacity: 0.7 }}>
      {message}
    </Text>
  </View>
);

const favoriteKey = (item) => `${item.kind}-${item.id}`;

const PlaceList = ({ data, loading, onRefresh, onSelect, ListHeaderComponent, favoriteIds, onToggleFavorite }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `${item.kind}-${item.id}`}
      renderItem={({ item }) => (
        <PlaceCard
          item={item}
          onPress={() => onSelect(item)}
          isFavorite={favoriteIds?.has(favoriteKey(item))}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<EmptyState message={loading ? "Loading..." : "No results found."} />}
    />
  );
};

export default PlaceList;
