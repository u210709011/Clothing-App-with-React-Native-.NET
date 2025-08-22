import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';

import { Colors } from '@/constants/Colors';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showRating?: boolean;
  reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  showRating = true,
  reviewCount,
}) => {
  // INFO: Render filled/outline stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={size}
          color={i <= rating ? '#FFD700' : '#E0E0E0'}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {showRating && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)}
          {reviewCount && ` (${reviewCount})`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
});

export default StarRating;
