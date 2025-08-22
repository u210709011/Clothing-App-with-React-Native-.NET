import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Text } from '@/components/atoms/Text';

import { useWishlist } from '@/store/user';

import { Colors } from '@/constants/Colors';




interface WishlistIconWithBadgeProps {
  size: number;
  color: string;
}

const WishlistIconWithBadge: React.FC<WishlistIconWithBadgeProps> = ({ size, color }) => {
  
  const { wishlistCount } = useWishlist();

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <MaterialIcons size={size} name="favorite" color={color} />
      {wishlistCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    top: -5,
    fontWeight: 'bold',
  },
});

export default WishlistIconWithBadge; 