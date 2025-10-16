import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { SlideInRight } from "react-native-reanimated";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <Animated.View
      entering={SlideInRight.duration(500)}
      style={styles.searchContainer}
    >
      <FontAwesome
        name="search"
        size={16}
        color="#666"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Cari catatan..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {searchQuery !== "" && (
        <TouchableOpacity onPress={onClearSearch}>
          <FontAwesome name="times-circle" size={16} color="#666" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});

export default SearchBar;
