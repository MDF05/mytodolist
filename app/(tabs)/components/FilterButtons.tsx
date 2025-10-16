import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Animated, { SlideInRight } from "react-native-reanimated";
import { Filter, SortOrder } from "../types/task.types";
import ThreeDButton from "./ThreeDButton";

interface FilterButtonsProps {
  filter: Filter;
  sortOrder: SortOrder;
  onFilterChange: (filter: Filter) => void;
  onSortChange: (sortOrder: SortOrder) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({
  filter,
  sortOrder,
  onFilterChange,
  onSortChange,
}) => {
  const filterListButton = [
    { key: "ALL", label: "Semua", icon: "list" as const },
    { key: "INCOMPLETE", label: "Aktif", icon: "clock-o" as const },
    { key: "COMPLETED", label: "Selesai", icon: "check-circle" as const },
    { key: "ARCHIVED", label: "Arsip", icon: "archive" as const },
    { key: "NEWEST", label: "Terbaru", icon: "sort-amount-desc" as const },
    { key: "OLDEST", label: "Terlama", icon: "sort-amount-asc" as const },
  ];

  return (
    <Animated.View
      entering={SlideInRight.duration(700)}
      style={styles.filterContainer}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filterListButton.map((item) => {
          const isSort = item.key === "NEWEST" || item.key === "OLDEST";
          const isActive =
            (!isSort && filter === item.key) ||
            (isSort && sortOrder === item.key);

          return (
            <ThreeDButton
              key={item.key}
              onPress={() =>
                isSort
                  ? onSortChange(item.key as SortOrder)
                  : onFilterChange(item.key as Filter)
              }
              title={item.label}
              icon={item.icon}
              color={isActive ? "#ff6b6b" : "#4a90e2"}
              style={styles.filterButton}
            />
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 15,
  },
  filterButton: {
    marginRight: 10,
    minWidth: 100,
  },
});

export default FilterButtons;
