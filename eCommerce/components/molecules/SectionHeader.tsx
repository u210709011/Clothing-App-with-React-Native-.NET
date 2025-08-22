import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/atoms/Icon";

import { Colors } from "@/constants/Colors";

interface SectionHeaderProps {
  title: string;
  showSeeAll?: boolean;
  navigateTo?: string;
  onSeeAllPress?: () => void;
  style?: any;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showSeeAll = true,
  navigateTo,
  onSeeAllPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAllPress}>
          <Text style={styles.seeAllText}>
            {navigateTo ? navigateTo : "See All"}
          </Text>

          <View style={styles.chevronContainer}>
            <Icon
              name="chevron-right"
              size={16}
              color={Colors.background}
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 14,
    paddingRight: 5,
    color: Colors.tabIconSelected,
    fontWeight: "600",
  },
  chevronContainer: {
    backgroundColor: Colors.tabIconSelected,
    borderRadius: 45,
    padding: 5,
  },
  chevron: {
  },
});

export default SectionHeader;
