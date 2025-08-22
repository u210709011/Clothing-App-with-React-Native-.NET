import React, { useState, useEffect, useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/atoms/Icon";
import ProductFilterView from "@/components/organisms/ProductFilterView";

import { ProductAPI, getCategoryBySlug } from "@/services/product";

import { Product } from "@/types/product";

import { Colors } from "@/constants/Colors";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();

  const navigation = useNavigation();

  const { top } = useSafeAreaInsets();

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const categorySlug = typeof slug === "string" ? slug : String(slug);

  const [categoryTitle, setCategoryTitle] = useState<string>("Category");

  // INFO: Hide default header on this screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // INFO: Fetch products + category meta for slug
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const [categoryInfo, fetchedProducts] = await Promise.all([
          getCategoryBySlug(categorySlug),
          ProductAPI.getProductsByCategory(categorySlug),
        ]);
        if (categoryInfo?.name) setCategoryTitle(categoryInfo.name);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryProducts();
    }
  }, [categorySlug]);

  if (loading) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: top,
        }}
      >
        <Icon name="hourglass-empty" size={32} color={Colors.textSecondary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, paddingTop: top }}>
      <ProductFilterView
        products={products}
        initialCategory={categorySlug}
        categoryTitle={categoryTitle}
        showSearchBar={true}
        placeholder={`Search in ${categoryTitle}`}
        headerTitle={categoryTitle}
        isCategoryScreen={true}
        headerActions={
          <TouchableOpacity style={{ padding: 4 }}>
            <Icon name="more-vert" size={24} color={Colors.text} />
          </TouchableOpacity>
        }
      />
    </ThemedView>
  );
}
