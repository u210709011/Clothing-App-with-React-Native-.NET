import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { Text } from "@/components/atoms/Text";
import { Image } from "@/components/atoms/Image";
import { Icon } from "@/components/atoms/Icon";
import QuantitySelector from "./QuantitySelector";  // EXCEPTION: This is an exception, molecules shouldn't import other molecules

import { CartItem as CartItemType } from "@/types/cart";


interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const formatVariants = () => {
    if (Object.keys(item.selectedVariants).length === 0) return null;

    return Object.entries(item.selectedVariants)
      .map(([, value]) => value)
      .join(" / ");
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/product/${item.product.id}`)}
    >
      <View style={styles.container}>
        <Image source={{ uri: item.product.images?.[0] || '' }} style={styles.image} />

        <View style={styles.infoContainer}>
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={2}>
              {item.product.name}
            </Text>
            {formatVariants() && (
              <Text style={styles.variants}>{formatVariants()}</Text>
            )}
            <Text style={styles.price}>
              ${(item.product.price * item.quantity).toFixed(2)}
            </Text>
          </View>

          <View style={styles.actions}>
            <QuantitySelector
              quantity={item.quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
            <TouchableOpacity
              onPress={handleRemove}
              style={styles.removeButton}
            >
              <Icon name="delete" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "white",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  variants: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: "auto",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  removeButton: {
    padding: 8,
  },
});

export default CartItem;
