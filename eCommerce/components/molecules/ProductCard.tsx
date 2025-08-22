import { StyleSheet, TouchableOpacity, ViewStyle, View, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';

import { Product } from '@/types/product';
import { createAppError, ErrorContext, ErrorSeverity } from '@/utils/errorHandling';

import { Text } from '../atoms/Text';
import { Image } from '../atoms/Image';
import { Icon } from '../atoms/Icon';
import { ThemedView } from '../ThemedView';

import { Colors } from '@/constants/Colors';

import { useWishlist } from '@/store/user';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  style?: ViewStyle;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style }) => {
  
  const router = useRouter();

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // INFO: Navigate to product detail
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  // INFO: Toggle wishlist state without triggering card press
  const handleWishlistPress = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    
    try {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    } catch (error) {
      createAppError(error, ErrorContext.WISHLIST_OPERATION, ErrorSeverity.MEDIUM);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images?.[0] }} style={styles.image} />
        <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlistPress}>
          <Icon 
            name={isInWishlist(product.id) ? "favorite" : "favorite-border"} 
            size={18} 
            color={isInWishlist(product.id) ? Colors.error : Colors.textSecondary} 
          />
        </TouchableOpacity>
        {product.discount && !product.isFlashSale && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
        {product.isFlashSale && (
          <View style={styles.flashSaleBadge}>
            <Text style={styles.flashSaleText}>-{product.discount ?? 0}%</Text>
          </View>
        )}
      </View>
      <ThemedView style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          {product.originalPrice && product.originalPrice > product.price && (
            <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
          )}
          {product.isFlashSale ? (
            <Text style={styles.flashSalePrice}>
              ${((product.originalPrice || product.price) * (1 - (product.discount ?? 0) / 100)).toFixed(2)}
            </Text>
          ) : (
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={12} color="#FFD700" />
          <Text style={styles.rating}>{(product.rating ?? 0).toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({typeof product.reviewCount === 'number' ? product.reviewCount : (product.reviews?.length ?? 0)})</Text>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 280,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  flashSaleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  flashSaleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  flashSalePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  infoContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 18,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    minHeight: 16,
  },
  rating: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 2,
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
});

export default ProductCard;
