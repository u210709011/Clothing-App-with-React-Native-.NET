import { Text as NativeText, StyleSheet, type TextProps as NativeTextProps } from 'react-native';

import { Colors } from '@/constants/Colors';

export type TextProps = NativeTextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function Text({
  style,
  type = 'default',
  ...rest
}: TextProps) {
  return (
    <NativeText
      style={[
        { color: Colors.text },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,  
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 32,
    fontWeight: '400',
  },
  defaultSemiBold: {
    fontSize: 12,
    lineHeight: 34,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 20,
    fontSize: 14,
    color: Colors.tabIconDefault,
  },
});
