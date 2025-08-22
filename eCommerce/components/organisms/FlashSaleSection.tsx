import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import SectionHeader from '@/components/molecules/SectionHeader';
import FlashSaleCard from '@/components/molecules/FlashSaleCard';

import { Colors } from '@/constants/Colors';

import { Product } from '@/types/product';

interface FlashSaleSectionProps {
  products: Product[];
  onSeeAllPress?: () => void;
  onProductPress: (product: Product) => void;
  title?: string;
  endTimeIso?: string | null;
}

const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onSeeAllPress,
  onProductPress,
  title = 'Flash Sale',
  endTimeIso,
}) => {

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // INFO: Countdown timer
  useEffect(() => {
    if (!endTimeIso) return;
    const end = new Date(endTimeIso).getTime();
    const tick = () => {
      const now = Date.now();
      const diffMs = Math.max(0, end - now);
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ hours, minutes, seconds });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endTimeIso]);
 
  // INFO: Renders HH:MM:SS pill UI
  const renderCountdownTimer = () => (
    <View style={styles.timerContainer}>
      <Icon name="timer" size={20} color={Colors.text} />
      <View style={styles.timerDigits}>
        <View style={styles.timeBox}>
          <Text style={styles.timeNumber}>{String(timeLeft.hours).padStart(2, '0')}</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeNumber}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeNumber}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SectionHeader
          title={title}
          showSeeAll={true}
          navigateTo="See the Deals"
          onSeeAllPress={onSeeAllPress}
          style={styles.sectionHeader}
        />
        {!!endTimeIso && renderCountdownTimer()}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
          <FlashSaleCard
            key={product.id}
            product={product}
            onPress={() => onProductPress(product)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
  },
  timerDigits: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  timeBox: {
    backgroundColor: Colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  timeNumber: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeSeparator: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 4,
  },
  scrollContent: {
    padding: 16,
  },
});

export default FlashSaleSection;