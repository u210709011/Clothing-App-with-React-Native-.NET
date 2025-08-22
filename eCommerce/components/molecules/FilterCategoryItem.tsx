import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Checkbox from '@/components/atoms/Checkbox';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { Colors } from '@/constants/Colors';

type Props = {
  name: string;
  checked: boolean;
  disabled?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onToggleCheck: () => void;
  onToggleExpand?: () => void;
};

const FilterCategoryItem: React.FC<Props> = ({
  name,
  checked,
  disabled = false,
  expandable = false,
  expanded = false,
  onToggleCheck,
  onToggleExpand,
}) => {
  return (
    <TouchableOpacity
      style={[styles.header, checked && styles.headerChecked]}
      onPress={() => onToggleExpand && onToggleExpand()}
      activeOpacity={0.8}
    >
      <View style={styles.rowLeft}>
        <Checkbox checked={checked} onChange={() => onToggleCheck()} disabled={disabled} size={16} style={{ marginRight: 12 }} />
        <Text style={[styles.text, checked && styles.textChecked]}>{name}</Text>
      </View>
      {expandable && (
        <Icon name={expanded ? 'expand-less' : 'expand-more'} size={24} color={Colors.icon} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerChecked: {
    backgroundColor: Colors.tabIconSelected + '08',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  textChecked: {
    color: Colors.tabIconSelected,
  },
});

export default FilterCategoryItem;


