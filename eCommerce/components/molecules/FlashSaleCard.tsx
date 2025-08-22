import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Image } from '@/components/atoms/Image';
import { Badge } from '@/components/atoms/Badge';

import { Colors } from '@/constants/Colors';

import { Product } from '@/types/product';


interface FlashSaleCardProps {
  product: Product;
  onPress: () => void;
}

const FlashSaleCard: React.FC<FlashSaleCardProps> = ({
  product,
  onPress,
}) => {
  const isFlashSale = product.isFlashSale;

  const flashDiscount = product.discount ?? 0;

  const originalPrice = product.originalPrice || product.price;

  const flashPrice = originalPrice * (1 - flashDiscount / 100);
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images?.[0] || '' }} style={styles.image} />
        <Badge
          text={`-${flashDiscount}%`}
          style={isFlashSale ? styles.flashSaleBadge : styles.discountBadge}
          textStyle={styles.discountText}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>
            ${originalPrice.toFixed(2)}
          </Text>
          <Text style={styles.salePrice}>
            ${flashPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4757',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  flashSaleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4757',
  },
});

export default FlashSaleCard;