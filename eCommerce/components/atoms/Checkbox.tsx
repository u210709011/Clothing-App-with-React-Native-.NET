import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { Colors } from '@/constants/Colors';

type CheckboxProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  size?: number;
  style?: ViewStyle;
};

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, disabled = false, size = 18, style }) => {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!checked)}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.box, { width: size, height: size, borderRadius: 4 }, style]}
    >
      <View
        style={[
          styles.inner,
          {
            backgroundColor: checked ? Colors.tabIconSelected : 'transparent',
            borderColor: checked ? Colors.tabIconSelected : Colors.border,
            borderWidth: 2,
            borderRadius: 4,
          },
        ]}
      >
        {checked && <Icon name="check" size={size - 8} color={Colors.background} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Checkbox;


