import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { Product } from '@/types/product';

import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import StarRating from '@/components/molecules/StarRating';
import SizeSelector from '@/components/molecules/SizeSelector';
import ColorPicker from '@/components/molecules/ColorPicker';

import { Colors } from '@/constants/Colors';

interface ProductInfoProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onVariantSelect: (variantId: string, value: string) => void;
  onWishlistToggle: () => void;
  isWishlisted: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedOptions,
  onVariantSelect,
  onWishlistToggle,
  isWishlisted,
}) => {
  
  const isFlashSale = !!product.isFlashSale;

  const discountPercent = product.discount ?? 0;

  const originalPrice = product.originalPrice && product.originalPrice > 0 ? product.originalPrice : product.price;

  const flashPrice = originalPrice * (1 - discountPercent / 100);

  return (
    <View style={styles.container}>
      {isFlashSale && (
        <View style={styles.flashSaleBanner}>
          <Icon name="flash-on" size={16} color="#FF6B35" />
          <Text style={styles.flashSaleText}>
            FLASH SALE: {discountPercent}% OFF
          </Text>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.priceContainer}>
          {isFlashSale ? (
            <>
              <Text style={styles.flashSalePrice}>${flashPrice.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
            </>
          ) : (
            <>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
              )}
            </>
          )}
        </View>
        <TouchableOpacity onPress={onWishlistToggle} style={styles.wishlistButton}>
          <Icon
            name={isWishlisted ? 'favorite' : 'favorite-border'}
            size={24}
            color={isWishlisted ? '#FF4757' : Colors.icon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.productName}>{product.name}</Text>

      <Text style={styles.description} numberOfLines={3}>
        {product.description}
      </Text>

      <View style={styles.ratingContainer}>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount ?? product.reviews.length}
          size={16}
        />
      </View>

      <View style={styles.variantsContainer}>
        {product.variants.map((variant) => {
          if (variant.name.toLowerCase() === 'color') {
            return (
              <ColorPicker
                key={variant.id}
                colors={variant.values}
                selectedColor={selectedOptions[variant.id]}
                onColorSelect={(color: string) => onVariantSelect(variant.id, color)}
              />
            );
          } else if (variant.name.toLowerCase() === 'size') {
            return (
              <SizeSelector
                key={variant.id}
                sizes={variant.values}
                selectedSize={selectedOptions[variant.id]}
                onSizeSelect={(size: string) => onVariantSelect(variant.id, size)}
              />
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  wishlistButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  variantsContainer: {
    gap: 16,
  },
  flashSaleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  flashSaleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  flashSaleTime: {
    fontSize: 12,
    color: '#FF6B35',
    marginLeft: 'auto',
  },
  flashSalePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
});

export default ProductInfo;