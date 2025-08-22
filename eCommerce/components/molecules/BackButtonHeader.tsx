import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Icon } from '@/components/atoms/Icon';
import { NavigationUtils } from '@/utils/navigation';



interface BackButtonHeaderProps {
  onPress?: () => void;
}

/**
 * INFO: Reusable back button for headers
 * Extracted to eliminate code duplication across screens
 */
const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ 
  onPress = NavigationUtils.goBack 
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="arrow-back" size={24} style={styles.backButton} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 4,
    marginRight: 16,
  },
});

export default BackButtonHeader;
