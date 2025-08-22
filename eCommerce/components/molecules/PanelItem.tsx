import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@/components/atoms/Text";
import { Colors } from "@/constants/Colors";
import { Image } from "../atoms/Image";

interface PanelItemProps {
  label: string;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  image?: string;
  onPress: () => void;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PanelItem: React.FC<PanelItemProps> = ({ label, icon, image, onPress, description, onEdit, onDelete }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.left}>
        {image && image.trim() !== '' ? <Image source={{ uri: image }} style={styles.image} /> : <MaterialIcons name={icon || 'question-mark'} size={24} color={Colors.text} />}
        <View style={styles.texts}>
          <Text style={styles.label}>{label}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <MaterialIcons name="edit" size={20} color={Colors.tabIconSelected} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <MaterialIcons name="delete" size={20} color={Colors.error} />
          </TouchableOpacity>
        )}
        {!onEdit && !onDelete && (
          <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  texts: {
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default PanelItem;