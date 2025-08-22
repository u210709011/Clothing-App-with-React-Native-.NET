import React, { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { FlatList, ActivityIndicator, View } from 'react-native';
import SearchBar from '@/components/molecules/SearchBar';
import FilterModal from '@/components/modals/FilterModal';
import ProductCard from '@/components/molecules/ProductCard';
import { Text } from '@/components/atoms/Text';
import { Colors } from '@/constants/Colors';
import { useProductSearch } from '@/hooks/useProductSearch';

export default function SearchScreen() {
  const { query, setQuery, setFilters, products, loading, hasMore, loadMore } = useProductSearch({ pageSize: 24 });
  const [filterVisible, setFilterVisible] = React.useState(false);

  const navigation = useNavigation();
  
  const { bottom, top } = useSafeAreaInsets();


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderFooter = () => (
    <View style={{ paddingVertical: 16 }}>
      {loading && hasMore ? <ActivityIndicator color={Colors.tabIconSelected} /> : null}
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, paddingBottom: bottom, paddingTop: top }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <SearchBar
          placeholder="Search products"
          value={query}
          onChangeText={setQuery}
          onSubmit={setQuery}
          showFilter={true}
          onFilterPress={() => setFilterVisible(true)}
          showBackButton={true}
        />
      </View>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%', marginHorizontal: 4, marginBottom: 8, marginTop: 8 }}>
            <ProductCard product={item} />
          </View>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasMore && !loading) loadMore();
        }}
        ListEmptyComponent={!loading ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Text>No results</Text>
          </View>
        ) : null}
        ListFooterComponent={renderFooter}
      />

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(f: any) => {
          setFilterVisible(false);
          setFilters({
            category: f.categories?.[0],
            subcategories: f.subcategories,
            minPrice: Array.isArray(f.priceRange) ? f.priceRange[0] : undefined,
            maxPrice: Array.isArray(f.priceRange) ? f.priceRange[1] : undefined,
            sortBy: f.sortBy,
          });
        }}
        preSelectedCategory={undefined}
        isCategoryScreen={false}
        initialFilters={undefined as any}
      />
    </ThemedView>
  );
}