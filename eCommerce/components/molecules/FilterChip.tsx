import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

import { Colors } from '@/constants/Colors';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  showRemove?: boolean;
  onRemove?: () => void;
  style?: ViewStyle;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected = false,
  onPress,
  showRemove = false,
  onRemove,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
      {showRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Icon name="close" size={16} color={selected ? Colors.background : Colors.icon} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedContainer: {
    backgroundColor: Colors.tabIconSelected,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedLabel: {
    color: Colors.background,
  },
  removeButton: {
    marginLeft: 8,
    padding: 2,
  },
});

export default FilterChip;

