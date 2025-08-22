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
import { Colors } from "@/constants/Colors";
import { useAdminRole } from "@/hooks/useAdminRole";
import { router, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "@/components/molecules/SearchBar";
import PanelItem from "@/components/molecules/PanelItem";
import { useUserSearch } from "@/hooks/useUserSearch";
import { apiDelete } from "@/services/api";
import UserEditModal from "@/components/modals/UserEditModal";
import { AdminUser } from "@/services/admin";

export default function AdminUsersScreen() {
  const { isAdmin, checked } = useAdminRole();

  const [userEditVisible, setUserEditVisible] = useState(false);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ title: "Users Panel", headerShadowVisible: false });
  }, [navigation]);

  const { bottom } = useSafeAreaInsets();

  const { query, setQuery, users, loading, hasMore, refresh, loadMore } =
    useUserSearch({ pageSize: 12 });
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

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
        placeholder="Search users (name, email, role)"
        value={query}
        onChangeText={setQuery}
        showFilter={false}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={{ marginTop: 12 }}>
            <PanelItem
              label={item.displayName || item.email || item.uid}
              icon="person"
              image={item.photoUrl}
              description={`${item.role ?? "User"}${
                item.email ? " • " + item.email : ""
              }`}
              onPress={() => {
                router.push(`/user/${item.uid}` as any);
              }}
              onEdit={() => {
                setSelectedUser(item);
                setUserEditVisible(true);
              }}
              onDelete={async () => {
                Alert.alert("Delete User", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await apiDelete<void>(`/admin/users/${item.uid}`);
                        refresh();
                      } catch {}
                    },
                  },
                ]);
              }}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasMore && !loading) loadMore();
        }}
        ListFooterComponent={
          loading && hasMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color={Colors.tabIconSelected} />
            </View>
          ) : null
        }
      />

      <UserEditModal
        visible={userEditVisible}
        user={selectedUser}
        onClose={() => setUserEditVisible(false)}
        onSaved={refresh}
      />
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
