import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Image } from '@/components/atoms/Image';
import { Text } from '@/components/atoms/Text';
import { Colors } from '@/constants/Colors';

type CategoryCircleProps = {
  title: string;
  imageUrl: string;
  onPress: () => void;
};

const CategoryCircle: React.FC<CategoryCircleProps> = ({ title, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.circleWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.circleImage} resizeMode="cover" />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const CIRCLE_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    width: 72,
    alignItems: 'center',
    marginRight: 12,
  },
  circleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.text,
  },
});

export default CategoryCircle;


