import React, { useLayoutEffect } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useNavigation } from 'expo-router';

import { useAuthContext } from '@/auth/providers/AuthProvider';

import { ThemedView } from '@/components/ThemedView';
import { Text } from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import CartItem from '@/components/molecules/CartItem';

import { useCart } from '@/hooks/useCart';

import { Colors } from '@/constants/Colors';


export default function CartScreen() {

  const { user } = useAuthContext(); // TODO: Implement user context


  const navigation = useNavigation();
  
  const {
    items,
    totalPrice,
    totalItems,
    isLoading,
    isEmpty,
    updateItemQuantity,
    removeItem,
    clear,
  } = useCart();

  // INFO: Reflect total item count in header and expose clear action
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `My Cart (${totalItems})`,
      headerRight: () => (
        <TouchableOpacity onPress={clear} style={styles.clearButton}>
          <Icon name="delete" size={24} color={Colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, totalItems, clear]);

  // INFO: Loading spinner while cart hydrates
  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.text} />
      </ThemedView>
    );
  }

  // INFO: Empty cart UI
  if (isEmpty) {
    return (
      <ThemedView style={styles.centered}>
        <Icon name="shopping-cart" size={64} color={Colors.icon} style={styles.emptyIcon} />
        <Text type="title" style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyText}>
          Looks like you haven't added anything to your cart yet.
        </Text>
        <Button title="Start Shopping" onPress={() => { router.push('/(tabs)/home') }} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={updateItemQuantity}
            onRemove={removeItem}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <ThemedView style={[styles.footer, { borderTopColor: Colors.icon, shadowColor: Colors.text }]}>
        <ThemedView style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text type="title" style={styles.totalAmount}>
            ${totalPrice.toFixed(2)}
          </Text>
        </ThemedView>
        
        <Button
          title="Proceed to Checkout"
          onPress={() => {
            // TODO: Navigate to checkout
            console.log("Navigate to checkout");
          }}
          style={styles.checkoutButton}
        />
      </ThemedView>
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
    padding: 20,
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingVertical: 16,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '80%',
  },
});
