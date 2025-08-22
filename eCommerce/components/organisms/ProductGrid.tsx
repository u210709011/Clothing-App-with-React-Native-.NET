import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import ProductCard from '../molecules/ProductCard';

import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ThemedView style={styles.cardContainer}>
          <ProductCard product={item} />
        </ThemedView>
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  cardContainer: {
    flex: 1 / 2,
  },
});

export default ProductGrid;
