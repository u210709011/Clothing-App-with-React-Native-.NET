import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

import { useCart } from '@/hooks/useCart';

interface CartIconWithBadgeProps {
  color: string;
  size?: number;
}

const CartIconWithBadge: React.FC<CartIconWithBadgeProps> = ({ 
  color, 
  size = 28 
}) => {
  const { totalItems } = useCart();

  return (
    <ThemedView style={styles.container}>
      <Icon size={size} name="shopping-cart" style={{ color: color }} />
      {totalItems > 0 && (
        <ThemedView style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? '99+' : totalItems.toString()}
          </Text>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    marginTop: -5,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartIconWithBadge;