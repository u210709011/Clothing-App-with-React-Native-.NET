import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

import { getMockSpecifications, getMockDeliveryOptions } from '@/services/mockData';

import { Colors } from '@/constants/Colors';

interface ProductSpecsProps {
  onSizeGuidePress?: () => void;
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({ onSizeGuidePress }) => {

  const specifications = getMockSpecifications();
  
  const deliveryOptions = getMockDeliveryOptions();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        {specifications.map((spec, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
        
        <TouchableOpacity onPress={onSizeGuidePress} style={styles.sizeGuideButton}>
          <Text style={styles.sizeGuideText}>Size guide</Text>
          <Icon name="chevron-right" size={16} color={Colors.tabIconSelected} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery</Text>
        {deliveryOptions.map((option, index) => (
          <View key={index} style={styles.deliveryRow}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryType}>{option.type}</Text>
              <Text style={styles.deliveryDuration}>{option.duration}</Text>
            </View>
            <Text style={styles.deliveryPrice}>{option.price}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  specLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  specValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  sizeGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.tabIconSelected,
    borderRadius: 8,
    marginTop: 12,
  },
  sizeGuideText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  deliveryDuration: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deliveryPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default ProductSpecs;