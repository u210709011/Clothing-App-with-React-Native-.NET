import React from 'react';
import { View, StyleSheet } from 'react-native';

type AccordionProps = {
  children: React.ReactNode;
  style?: any;
};

export const Accordion: React.FC<AccordionProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

type AccordionItemProps = {
  header: React.ReactNode;
  expanded: boolean;
  children?: React.ReactNode;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ header, expanded, children }) => {
  return (
    <View style={styles.item}>
      {header}
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  item: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  content: {
    paddingLeft: 8,
    paddingBottom: 8,
    backgroundColor: '#F8F9FA',
  },
});

export default Accordion;


