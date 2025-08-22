import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/atoms/Button";
import { Colors } from "@/constants/Colors";
import { useAdminRole } from "@/hooks/useAdminRole";
import { router, useNavigation } from "expo-router";
import { useProductSearch } from "@/hooks/useProductSearch";
import PanelItem from "@/components/molecules/PanelItem";
import SearchBar from "@/components/molecules/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductAPI, getProductById } from "@/services/product";
import ProductEditModal from "@/components/modals/ProductEditModal";
import { Product } from "@/types/product";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminProductsScreen() {
  const { isAdmin, checked } = useAdminRole();

  const { bottom } = useSafeAreaInsets();

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Products Panel",
      headerShadowVisible: false,
      headerRight: () => (
        <MaterialIcons
          name="add"
          size={24}
          color={Colors.tabIconSelected}
          onPress={() => {
            setSelectedProduct(null);
            setProductEditVisible(true);
          }}
        />
      ),
    });
  }, [navigation]);

  const [productEditVisible, setProductEditVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { query, setQuery, products, loading, hasMore, refresh, loadMore } =
    useProductSearch({ pageSize: 12 });

  useEffect(() => {
    if (checked && !isAdmin) {
      router.replace("/(tabs)/home");
    }
  }, [checked, isAdmin]);

  if (!checked) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.tabIconSelected} />
      </View>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <ThemedView style={[styles.container, { paddingBottom: bottom }]}>
      <SearchBar
        placeholder="Search products"
        value={query}
        onChangeText={setQuery}
        showFilter={false}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <PanelItem
              label={item.name}
              icon="inventory"
              image={item.images?.[0]}
              description={`$${item.price.toFixed(2)}`}
              onPress={() => {
                router.push(`/product/${item.id}`);
              }}
              onEdit={async () => {
                try {
                  const detail = await getProductById(item.id);
                  setSelectedProduct(detail || (item as unknown as Product));
                } finally {
                  setProductEditVisible(true);
                }
              }}
              onDelete={async () => {
                Alert.alert("Delete Product", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await ProductAPI.deleteProduct(item.id);
                        refresh();
                      } catch {}
                    },
                  },
                ]);
              }}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasMore && !loading) loadMore();
        }}
        ListFooterComponent={
          loading && hasMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator color={Colors.tabIconSelected} />
            </View>
          ) : null
        }
      />

      <ProductEditModal
        visible={productEditVisible}
        product={selectedProduct}
        onClose={() => setProductEditVisible(false)}
        onSaved={refresh}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: { paddingTop: 8, paddingBottom: 16 },
  separator: { height: 12 },
  row: { width: "100%" },
  footerLoading: { paddingVertical: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
