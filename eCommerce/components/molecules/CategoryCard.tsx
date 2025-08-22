import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

import { Text } from "@/components/atoms/Text";
import { Image } from "@/components/atoms/Image";
import { Badge } from "@/components/atoms/Badge";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; 
const placeholderImage = 'https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2021/06/Pikachu-color-model-publicity-cel.jpg';


// TODO: UNUSED Use when see all implemented




interface CategoryCardProps {
  title: string;
  subtitle?: string;
  count: number;
  imageUrls: string[];
  backgroundColor: string;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  count,
  imageUrls,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.imageContainer]}>
        <View style={styles.imageGrid}>
        <Image
              source={{ uri: (imageUrls[0] ? imageUrls[0] : placeholderImage) }}
              style={styles.image}
              resizeMode="cover"
              />
              <Image
              source={{ uri: (imageUrls[1] ? imageUrls[1] : placeholderImage) }}
              style={styles.image}
              resizeMode="cover"
              />
              <Image
              source={{ uri: (imageUrls[2] ? imageUrls[2] : placeholderImage) }}
              style={styles.image}
              resizeMode="cover"
              />
              <Image
              source={{ uri: (imageUrls[3] ? imageUrls[3] : placeholderImage) }}
              style={styles.image}
              resizeMode="cover"
              />
              
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Badge 
          text={count.toString()} 
          backgroundColor="#e6f3ff"
          textColor="#0a7ea4"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    height: 120,
    padding: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    overflow: 'hidden',
  },
  image: {
    width: '50%',
    height: '50%',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 2,
  },
  textContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
});

export default CategoryCard;
