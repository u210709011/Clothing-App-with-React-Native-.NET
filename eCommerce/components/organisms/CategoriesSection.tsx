import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import SectionHeader from '@/components/molecules/SectionHeader';
import CategoryCircle from '@/components/molecules/CategoryCircle';

import { Category } from '@/types/product';

interface CategoriesSectionProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onCategoryPress,
}) => {
  
  return (
    <View>
      <SectionHeader title="Categories" showSeeAll={false} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {categories.map((category) => (
          <CategoryCircle
            key={category.id}
            title={category.name}
            imageUrl={category.imageUrl ?? ''}
            onPress={() => onCategoryPress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  
  horizontalList: {
    paddingHorizontal: 16,
  },
});

export default CategoriesSection;