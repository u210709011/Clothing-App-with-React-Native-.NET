import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';


import PanelItem from '@/components/molecules/PanelItem';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';


export default function AdminTab() {
  const { isAdmin, checked } = useAdminRole();

  useEffect(() => {
    if (checked && !isAdmin) {
      router.navigate("/(tabs)/home")
    }
  }, [checked, isAdmin]);

  if (!checked) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.tabIconSelected} />
      </View>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.list}>
          <PanelItem
            label="Users"
            icon="people"
            description="Manage users and roles"
            onPress={() => router.push('/admin-panel/users')}
          />
          <PanelItem
            label="Products"
            icon="inventory"
            description="Manage Products"
            onPress={() => router.push('/admin-panel/products')}
          />
          <PanelItem
            label="Categories"
            icon="category"
            description="Manage Categories"
            onPress={() => router.push('/admin-panel/categories')}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  list: {
    width: '100%',
    maxWidth: 520,
  },
  spacer: {
    height: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 200,
  },
  logoutButton: {
    marginTop: 16,
  },
});


