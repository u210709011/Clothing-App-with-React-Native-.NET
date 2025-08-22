import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import SectionHeader from '@/components/molecules/SectionHeader';
import ProductCard from '@/components/molecules/ProductCard';

import { Product } from '@/types/product';

interface ProductListSectionProps {
  title?: string;
  products: Product[];
  onProductPress: (product: Product) => void;
  onSeeAllPress?: () => void;
  showSeeAll?: boolean;
}

const ProductListSection: React.FC<ProductListSectionProps> = ({
  title,
  products,
  onProductPress,
  onSeeAllPress,
  showSeeAll = true,
}) => {
  return (
    <View style={styles.container}>
      {title && (
      <SectionHeader
        title={title}
        showSeeAll={showSeeAll}
        onSeeAllPress={onSeeAllPress}
      />
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={160}
      >
        {products.map((product) => (
          <View key={product.id} style={styles.productContainer}>
            <ProductCard
              product={product}
              onPress={() => onProductPress(product)}
              style={styles.productCard}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  productContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  productCard: {
    width: 148,
  },
});

export default ProductListSection; 