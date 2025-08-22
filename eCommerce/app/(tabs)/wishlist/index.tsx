import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Text } from '@/components/atoms/Text';
import ProductCard from '@/components/molecules/ProductCard';

import { useWishlist } from '@/store/user';

import { Colors } from '@/constants/Colors';

export default function WishlistScreen() {
  
  const { wishlistItems, isLoading, loadWishlist } = useWishlist();

  useEffect(() => {
    loadWishlist();
  }, []);

  // INFO: Empty state UI
  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Add items to your wishlist by tapping the heart icon on products
      </Text>
    </View>
  );

  const renderWishlistItem = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      style={styles.productCard}
    />
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <Text>Loading wishlist...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {wishlistItems.length === 0 ? (
        renderEmptyWishlist()
      ) : (
        <FlatList
          data={wishlistItems}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderWishlistItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    width: '48%',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});