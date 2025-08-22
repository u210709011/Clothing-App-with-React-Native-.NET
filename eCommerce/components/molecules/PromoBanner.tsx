import React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Image } from '@/components/atoms/Image';

import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface PromoBannerProps {
  title: string;
  subtitle: string;
  discount?: string;
  imageUrl: string;
  backgroundColor: string;
  onPress: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  discount,
  imageUrl,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {discount && <Text style={styles.discount}>{discount}</Text>}
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 60,
    height: 120,
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 6,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.background,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.background,
    opacity: 0.9,
    marginBottom: 8,
  },
  discount: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.8,
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default PromoBanner;