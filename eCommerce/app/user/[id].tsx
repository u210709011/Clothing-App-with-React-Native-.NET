import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/atoms/Text";
import BackButtonHeader from "@/components/molecules/BackButtonHeader";
import { Colors } from "@/constants/Colors";
import { useAdminRole } from "@/hooks/useAdminRole";
import { getAdminUsers, AdminUser } from "@/services/admin";

export default function AdminUserDetailScreen() {
  const { id } = useLocalSearchParams();
  const uid = typeof id === "string" ? id : "";
  const { isAdmin, checked } = useAdminRole();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {}, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getAdminUsers(500);
        if (!mounted) return;
        setUsers(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const user = useMemo(() => users?.find((u) => u.uid === uid), [users, uid]);

  if (!checked) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.tabIconSelected} />
      </View>
    );
  }
  if (!isAdmin) return null;

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen
          options={{ title: "User", headerLeft: () => <BackButtonHeader /> }}
        />
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen
          options={{ title: "User", headerLeft: () => <BackButtonHeader /> }}
        />
        <Text>User not found.</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: user.displayName || user.email || "User",
          headerLeft: () => <BackButtonHeader />,
        }}
      />
      <View style={styles.section}>
        <Text style={styles.label}>UID</Text>
        <Text>{user.uid}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <Text>{user.email || "-"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Display Name</Text>
        <Text>{user.displayName || "-"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Role</Text>
        <Text>{user.role || "User"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Disabled</Text>
        <Text>{user.disabled ? "Yes" : "No"}</Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  section: { marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 4, color: Colors.textSecondary },
});
