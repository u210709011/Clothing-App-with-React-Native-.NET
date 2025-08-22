import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { Text } from '@/components/atoms/Text'; // EXCEPTION: Normally, atoms don't import other atoms but this is an exception

import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title?: string;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  type?: 'default' | 'link' | 'chip' | 'outline' ;
  selected?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  color,
  onPress,
  style,
  textStyle,
  type = 'default',
  selected = false,
  children,
  disabled = false,
}) => {
  const isChip = type === 'chip';
  const isOutline = type === 'outline';
  
  return (
    <TouchableOpacity
      style={[
        type === 'default' && styles.button,
        color && { backgroundColor: color },
        isChip && styles.chip,
        isChip && selected && styles.chipSelected,
        isOutline && styles.outline,
        disabled && { opacity: 0.6 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {title ? (
        <Text
          style={[
            styles.text,
            type === 'link' && styles.link,
            isChip && styles.chipText,
            isChip && selected && styles.chipSelectedText,
            isOutline && styles.outlineText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tabIconSelected,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
    color: 'white',
  },
  link: {
    color: Colors.tabIconDefault,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipSelectedText: {
    color: '#fff',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.tabIconDefault,
  },
  outlineText: {
    color: Colors.tabIconDefault,
  },
});

export default Button;
