import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import { Colors } from "@/constants/Colors";
import { useAdminRole } from "@/hooks/useAdminRole";
import { router, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "@/components/molecules/SearchBar";
import PanelItem from "@/components/molecules/PanelItem";
import { useCategorySearch } from "@/hooks/useCategorySearch";
import { deleteCategory, getSubcategories } from "@/services/product";
import CategoryEditModal from "@/components/modals/CategoryEditModal";
import { Category } from "@/types/product";
import { Icon } from "@/components/atoms/Icon";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminCategoriesScreen() {
  const { isAdmin, checked } = useAdminRole();

  const { bottom } = useSafeAreaInsets();

  const navigation = useNavigation();

  const [categoryEditVisible, setCategoryEditVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [parentForNewSubId, setParentForNewSubId] = useState<string | null>(null);

  const { query, setQuery, categories, loading, hasMore, refresh, loadMore } =
    useCategorySearch({ pageSize: 12 });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Categories Panel",
      headerShadowVisible: false,
      headerRight: () => (
        <MaterialIcons
          name="add"
          size={24}
          color={Colors.tabIconSelected}
          onPress={() => {
            setSelectedCategory(null);
            setCategoryEditVisible(true);
          }}
        />
      ),
    });
  }, [navigation]);

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
        placeholder="Search categories"
        value={query}
        onChangeText={setQuery}
        showFilter={false}
      />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <PanelItem
              label={item.name}
              icon="category"
              image={item.imageUrl}
              description={`Slug: ${item.slug}`}
              onPress={() => router.push(`/category/${item.slug}`)}
              onEdit={() => {
                setSelectedCategory(item);
                setCategoryEditVisible(true);
              }}
              onDelete={async () => {
                Alert.alert("Delete Category", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await deleteCategory(item.slug);
                        refresh();
                      } catch {}
                    },
                  },
                ]);
              }}
            />
            <SubcategoryList
              parentSlug={item.slug}
              parentId={item.id}
              onAddSub={() => {
                setSelectedCategory(null);
                setParentForNewSubId(item.id);
                setCategoryEditVisible(true);
              }}
              onEditSub={(sub) => {
                setSelectedCategory({ id: sub.id ?? '', name: sub.name, slug: sub.slug, imageUrl: sub.imageUrl });
                setParentForNewSubId(null);
                setCategoryEditVisible(true);
              }}
              onDeleteSub={(slug) => {
                Alert.alert("Delete Subcategory", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try { await deleteCategory(slug); refresh(); } catch {}
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

      <CategoryEditModal
        visible={categoryEditVisible}
        category={selectedCategory}
        parentId={parentForNewSubId}
        onClose={() => { setCategoryEditVisible(false); setParentForNewSubId(null); }}
        onSaved={() => { setParentForNewSubId(null); refresh(); }}
      />
    </ThemedView>
  );
}

function SubcategoryList({
  parentSlug,
  parentId,
  onAddSub,
  onEditSub,
  onDeleteSub,
}: {
  parentSlug: string;
  parentId: string;
  onAddSub: () => void;
  onEditSub: (sub: { id?: string; name: string; slug: string; imageUrl?: string }) => void;
  onDeleteSub: (slug: string) => void;
}) {
  const [subs, setSubs] = React.useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const s = await getSubcategories(parentSlug);
        if (!mounted) return;
        setSubs(s);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [parentSlug]);

  if (loading) {
    return <View style={{ marginTop: 6, marginLeft: 40 }}><ActivityIndicator color={Colors.tabIconSelected} /></View>;
  }
  return (
    <View style={{ marginTop: 6, marginLeft: 40, gap: 8 }}>
      {subs.length === 0 && (
        <Text style={{ color: Colors.textSecondary }}>No subcategories yet.</Text>
      )}
      {subs.map((sc) => (
        <View
          key={sc.slug}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: Colors.textSecondary }}>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={Colors.textSecondary}
            />{" "}
            {sc.name} ({sc.slug})
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.subIcon}
              onPress={() => onEditSub(sc)}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={Colors.tabIconSelected}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.subIcon}
              onPress={() => onDeleteSub(sc.slug)}
            >
              <MaterialIcons name="delete" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.subIcon}
        onPress={onAddSub}
      >
        <MaterialIcons name="add" color={Colors.tabIconSelected} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  separator: { height: 12 },
  row: {
    width: "100%",
    gap: 6,
  },
  footerLoading: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  subIcon: {
    marginHorizontal: 4,
  },
});
