import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';

import { Colors } from '@/constants/Colors';

interface ColorPickerProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => {
  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'red': '#FF4757',
      'blue': '#3742FA',
      'green': '#2ED573',
      'black': '#2F3542',
      'white': '#F1F2F6',
      'yellow': '#FFA502',
      'pink': '#FF6B9D',
      'purple': '#A4B0BE',
      'orange': '#FF6348',
      'brown': '#8B4513',
    };
    return colorMap[colorName.toLowerCase()] || '#000000';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Colors</Text>
      <View style={styles.colorContainer}>
        {colors.map((color) => {
          const colorValue = getColorValue(color);
          const isSelected = selectedColor === color;
          
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: colorValue },
                isSelected && styles.selectedColor,
                colorValue === '#F1F2F6' && styles.whiteColorBorder,
              ]}
              onPress={() => onColorSelect(color)}
            >
              {isSelected && (
                <Icon
                  name="check"
                  size={16}
                  color={colorValue === '#F1F2F6' || colorValue === '#FFA502' ? '#000' : '#FFF'}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: Colors.tabIconSelected,
    borderWidth: 3,
  },
  whiteColorBorder: {
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
});

export default ColorPicker;
