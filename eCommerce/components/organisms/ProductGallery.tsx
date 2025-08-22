import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Image } from '../atoms/Image';

interface ProductGalleryProps {
  images: string[];
  onActiveImageChange?: (index: number) => void;
  onImagePress?: (index: number) => void;
}

const { width } = Dimensions.get('window');


const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  onActiveImageChange,
  onImagePress,
}) => {

  const [activeIndex, setActiveIndex] = useState(0);

  // INFO: Snap index from horizontal scroll offset
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
    onActiveImageChange?.(index);
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={images}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => onImagePress?.(index)}>
            <Image source={{ uri: item }} style={styles.image} />
          </Pressable>
        )}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />
      <ThemedView style={styles.pagination}>
        {images.map((_, index) => (
          <ThemedView
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? '#ccc' : '#333'},
            ]}
          />
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  image: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ProductGallery;
