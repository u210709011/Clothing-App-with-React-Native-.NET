import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import ImageViewer from 'react-native-image-zoom-viewer';

import { useProductDetail } from '@/hooks/useProductDetail';
import { NavigationUtils, ProductFilters } from '@/utils/navigation';


import { Product } from '@/types/product';

import { ThemedView } from '@/components/ThemedView';
import { Text } from '@/components/atoms/Text';
import BackButtonHeader from '@/components/molecules/BackButtonHeader';
import ProductActionButtons from '@/components/molecules/ProductActionButtons';
import ProductGallery from '@/components/organisms/ProductGallery';
import ProductInfo from '@/components/organisms/ProductInfo';
import ProductSpecs from '@/components/organisms/ProductSpecs';
import ReviewSection from '@/components/organisms/ReviewSection';
import ProductListSection from '@/components/organisms/ProductListSection';


export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const productId = typeof id === 'string' ? id : null;
  
  const {
    product,
    loading,
    selectedOptions,
    isImageViewerVisible,
    currentImageIndex,
    handleVariantSelect,
    handleAddToCart,
    handleWishlistToggle,
    handleImagePress,
    closeImageViewer,
    isWishlisted,
  } = useProductDetail({ productId });

  
  const handleSizeGuidePress = () => NavigationUtils.goToSizeGuide();
  const handleBuyNow = () => NavigationUtils.goToCheckout();
  const handleProductPress = (product: Product) => {
    if (product?.id) {
      NavigationUtils.goToProduct(product.id);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen options={{ 
          title: "Loading...", 
          headerLeft: () => <BackButtonHeader />
        }} />
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen options={{ 
          title: "Product", 
          headerLeft: () => <BackButtonHeader />
        }} />
        <Text>Product not found.</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: product.name, 
        headerLeft: () => <BackButtonHeader />
      }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProductGallery
          images={product?.images || []}
          onImagePress={handleImagePress}
        />
        
        <ProductInfo
          product={product}
          selectedOptions={selectedOptions}
          onVariantSelect={handleVariantSelect}
          onWishlistToggle={handleWishlistToggle}
          isWishlisted={isWishlisted}
        />

        <ProductSpecs onSizeGuidePress={handleSizeGuidePress} />

        <ReviewSection
          reviews={product.reviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
          onViewAllReviews={() => NavigationUtils.goToReviews(product.id)}
        />

        <ProductListSection
          title="Most Popular"
          products={[]} // TODO: Implement related products fetching
          onProductPress={handleProductPress}
          onSeeAllPress={() => NavigationUtils.goToProducts(ProductFilters.POPULAR)}
        />

        <ProductListSection
          title="You Might Like"
          products={[]} // TODO: Implement related products fetching
          onProductPress={handleProductPress}
          onSeeAllPress={() => NavigationUtils.goToProducts(ProductFilters.RECOMMENDED)}
          showSeeAll={false}
        />
      </ScrollView>
      
      <ProductActionButtons
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
      <Modal visible={isImageViewerVisible} transparent={true}>
        <ImageViewer
          imageUrls={(product?.images || []).map(uri => ({ url: uri })) || []}
          index={currentImageIndex}
          onSwipeDown={closeImageViewer}
          onClick={closeImageViewer}
          enableSwipeDown={true}
          enablePreload={true}
          renderIndicator={() => <View />}
          renderFooter={(currentIndex) => {
            const totalImages = (product?.images || []).length || 0;
            return (
              <ThemedView style={styles.imageViewerFooter}>
                <Text style={styles.imageCounter}>
                  {(currentIndex || 0) + 1} / {totalImages}
                </Text>
              </ThemedView>
            );
          }}
        />
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerFooter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  imageCounter: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
