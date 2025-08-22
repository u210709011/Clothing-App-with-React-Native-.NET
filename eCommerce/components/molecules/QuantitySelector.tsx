import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <ThemedView style={styles.quantityContainer}>
      <TouchableOpacity onPress={onDecrement} style={styles.quantityButton}>
        <Icon name="remove" size={16} color="#333" />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrement} style={styles.quantityButton}>
        <Icon name="add" size={16} color="#333" />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
});

export default QuantitySelector;
