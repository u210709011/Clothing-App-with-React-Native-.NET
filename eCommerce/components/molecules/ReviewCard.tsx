import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Review } from '@/types/product';

import { Text } from '@/components/atoms/Text';
import StarRating from './StarRating'; // EXCEPTION: This is an exception, molecules shouldn't import other molecules

import { Colors } from '@/constants/Colors';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{review.author.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.nameRating}>
            <Text style={styles.authorName}>{review.author}</Text>
            <StarRating rating={review.rating} size={14} showRating={false} />
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(review.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.comment} numberOfLines={3}>
        {review.comment}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tabIconSelected,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nameRating: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  comment: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});

export default ReviewCard;
