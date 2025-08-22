import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router, useNavigation } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import PromoBanner from "@/components/molecules/PromoBanner";
import SearchBar from "@/components/molecules/SearchBar";
import FlashSaleSection from "@/components/organisms/FlashSaleSection";
import CategoriesSection from "@/components/organisms/CategoriesSection";
import ProductListSection from "@/components/organisms/ProductListSection";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useFlashSale } from "@/hooks/useFlashSale";
import { useRefreshableData } from "@/hooks/useRefreshableData";

import { getMockPromoBanners } from "@/services/mockData"; // TODO: Remove mock data
import { NavigationUtils, ProductFilters } from "@/utils/navigation";
import { createProductSections } from "@/utils/productSections";
import { PromoBanner as PromoBannerType, NavigationSection } from "@/types/ui";

import { Product, Category } from "@/types/product";

import { Colors } from "@/constants/Colors";


export default function HomeScreen() {
  const navigation = useNavigation();
  
  const { products, loading: productsLoading, refresh: refreshProducts } = useProducts({
    initialFilters: { sortBy: 'newest' }
  });
  
  const { categories, loading: categoriesLoading, refresh: refreshCategories } = useCategories();
  
  const { 
    flashSaleProducts, 
    flashSaleTitle, 
    flashSaleEndTime, 
    loading: flashSaleLoading, 
    refresh: refreshFlashSale 
  } = useFlashSale();
  
  const { refreshing, onRefresh } = useRefreshableData(
    { refresh: refreshProducts },
    { refresh: refreshCategories },
    { refresh: refreshFlashSale }
  );
  
  const loading = productsLoading && categoriesLoading && flashSaleLoading;


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Shop",
      headerShadowVisible: false,
      headerRight: () => (
        <ThemedView style={styles.headerRight}>
          <SearchBar
            placeholder="Search"
            editable={false}
            onPress={NavigationUtils.goToSearch}
            inHeader={true}
          />
        </ThemedView>
      ),
    });
  }, [navigation]);

  const promoBanners = getMockPromoBanners();
  
  const productSections = createProductSections(products);

  const handleProductPress = (product: Product) => {
    NavigationUtils.goToProduct(product.id);
  };

  const handleCategoryPress = (category: Category) => {
    NavigationUtils.goToCategory(category.slug);
  };

  const handleSeeAllPress = (section: NavigationSection) => {
    switch (section) {
      case 'new-items':
        NavigationUtils.goToProducts(ProductFilters.NEWEST);
        break;
      case 'flash-sale':
        NavigationUtils.goToProducts(ProductFilters.FLASH_SALE);
        break;
      case 'popular':
        NavigationUtils.goToProducts(ProductFilters.POPULAR);
        break;
      case 'recommended':
        NavigationUtils.goToProducts(ProductFilters.RECOMMENDED);
        break;
      case 'trending':
        NavigationUtils.goToProducts(ProductFilters.TRENDING);
        break;
      default:
        break;
    }
  };

  const renderPromoBanner = ({ item }: { item: PromoBannerType }) => (
    <PromoBanner
      title={item.title}
      subtitle={item.subtitle}
      discount={item.discount}
      imageUrl={item.imageUrl}
      backgroundColor={item.backgroundColor}
      onPress={() => {
        // TODO: Implement promo banner navigation
      }}
    />
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.tabIconSelected} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.bannerContainer}
        >
          {promoBanners.map((item) => (
            <ThemedView key={item.id} style= {styles.promoBanner}>
              {renderPromoBanner({ item })}
            </ThemedView>
          ))}

        </ScrollView>

        <CategoriesSection
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />


        <FlashSaleSection
          title={flashSaleTitle}
          endTimeIso={flashSaleEndTime}
          products={flashSaleProducts}
          onProductPress={handleProductPress}
          onSeeAllPress={() => handleSeeAllPress("flash-sale")}
        />

        {productSections.map((section) => (
          <ProductListSection
            key={section.sectionKey}
            title={section.title}
            products={section.products}
            onProductPress={handleProductPress}
            onSeeAllPress={() => handleSeeAllPress(section.sectionKey as NavigationSection)}
          />
        ))}

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bannerContainer: {
    paddingTop: 10,
    paddingHorizontal: 16
  },
  promoBanner: {
  },
  headerRight: {
    paddingRight: 25,
    flex: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
  },
});
