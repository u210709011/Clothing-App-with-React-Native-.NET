import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Text } from '../atoms/Text';
import Button from '../atoms/Button';

import { ProductVariant } from '@/types/product';


interface VariantSelectorProps {
  variant: ProductVariant;
  onSelect: (variantId: string, value: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variant,
  onSelect,
}) => {
  
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(variant.id, value);
  };

  return (
    <ThemedView style={styles.container}>
      <Text type="defaultSemiBold" style={styles.name}>
        {variant.name}
      </Text>
      <ThemedView style={styles.valuesContainer}>
        {variant.values.map((value) => (
          <Button
            key={value}
            title={value}
            type="chip"
            selected={selectedValue === value}
            onPress={() => handleSelect(value)}
          />
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  name: {
    marginBottom: 8,
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default VariantSelector;
