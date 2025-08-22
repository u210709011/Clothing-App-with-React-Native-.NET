import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { Review } from '@/types/product';

import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import StarRating from '@/components/molecules/StarRating';
import ReviewCard from '@/components/molecules/ReviewCard';

import { Colors } from '@/constants/Colors';

interface ReviewSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount?: number;
  onViewAllReviews?: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  rating,
  reviewCount,
  onViewAllReviews,
}) => {
  
  const displayedReviews = reviews.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Rating & Reviews</Text>
        <TouchableOpacity onPress={onViewAllReviews} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Reviews</Text>
          <Icon name="chevron-right" size={16} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.overallRating}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingNumber}>{rating}/5</Text>
          <StarRating rating={rating} size={20} showRating={false} />
          <Text style={styles.reviewCount}>Based on {reviewCount ?? reviews.length} reviews</Text>
        </View>
      </View>

      {displayedReviews.length > 0 && (
        <View style={styles.reviewContainer}>
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>
      )}
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
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabIconSelected,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  ratingLeft: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  reviewContainer: {
    marginTop: 8,
  },
});

export default ReviewSection;
