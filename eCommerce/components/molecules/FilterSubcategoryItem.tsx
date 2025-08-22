import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Checkbox from '@/components/atoms/Checkbox';
import { Text } from '@/components/atoms/Text';
import { Colors } from '@/constants/Colors';

type Props = {
  name: string;
  checked: boolean;
  onToggle: () => void;
};

const FilterSubcategoryItem: React.FC<Props> = ({ name, checked, onToggle }) => {
  return (
    <TouchableOpacity style={[styles.item, checked && styles.itemChecked]} onPress={onToggle} activeOpacity={0.8}>
      <View style={styles.row}>
        <Checkbox checked={checked} onChange={onToggle} size={14} style={{ marginRight: 12 }} />
        <Text style={[styles.text, checked && styles.textChecked]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  itemChecked: {
    backgroundColor: Colors.tabIconSelected + '08',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  textChecked: {
    color: Colors.tabIconSelected,
    fontWeight: '500',
  },
});

export default FilterSubcategoryItem;


