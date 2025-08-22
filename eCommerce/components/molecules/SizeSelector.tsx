import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

import { Colors } from '@/constants/Colors';


interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSizeSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Variations</Text>
      <View style={styles.sizeContainer}>
        {sizes.map((size) => (
          <Button
            key={size}
            title={size}
            type="chip"
            selected={selectedSize === size}
            onPress={() => onSizeSelect(size)}
            style={styles.sizeButton}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeButton: {
    minWidth: 48,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
});

export default SizeSelector;