import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';

import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/Colors';


interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  showBackButton?: boolean;
  editable?: boolean;
  onPress?: () => void;
  inHeader?: boolean; 
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search",
  value,
  onChangeText,
  onSearchPress,
  onSubmit,
  onFilterPress,
  showFilter = false,
  showBackButton = false,
  editable = true,
  onPress,
  inHeader = false,
}) => {
  // INFO: tap mode
  const handlePress = () => {
    if (!editable && onPress) {
      onPress();
    }
  };

  return (
    <View style={[styles.container, inHeader && styles.headerContainer]}>
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={Colors.icon} />
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={[styles.searchContainer, !editable && styles.touchableSearch]} 
        onPress={handlePress}
        disabled={editable}
      >
        <Icon name="search" size={20} color={Colors.icon} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.icon}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
          returnKeyType="search"
          onSubmitEditing={(e) => onSubmit && onSubmit(e.nativeEvent.text)}
        />
        {onSearchPress && (
          <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
            <Icon name="search" size={20} color={Colors.tabIconSelected} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      {showFilter && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Icon name="tune" size={20} color={Colors.tabIconSelected} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  headerContainer: {
    paddingHorizontal: 0,
    flex: 1, 
    minWidth: 200,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: Colors.tabIconSelected,
    minHeight: 36, 
    height: 36, 
    width: '100%',
  },
  touchableSearch: {
    backgroundColor: '#F8F9FA',
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginBottom: -3,
    color: Colors.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  searchButton: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default SearchBar;
