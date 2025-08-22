import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/atoms/Button';
import { ThemedView } from '@/components/ThemedView';



interface ProductActionButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
}

/**
 * INFO: Action buttons for product detail screen
 * Separated for better reusability and cleaner code
 */
const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({
  onAddToCart,
  onBuyNow,
  disabled = false,
}) => {
  const { bottom } = useSafeAreaInsets();
  
  return (
    <ThemedView style={[styles.container, { paddingBottom: bottom || 16 }]}>
      <View style={styles.buttonGroup}>
        <Button
          title="Add to cart"
          onPress={onAddToCart}
          style={styles.addToCartButton}
          disabled={disabled}
        />
        <Button
          title="Buy now"
          onPress={onBuyNow}
          style={styles.buyNowButton}
          disabled={disabled}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
});

export default ProductActionButtons;
