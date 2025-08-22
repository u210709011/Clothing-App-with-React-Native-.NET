import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/atoms/Text";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Colors } from "@/constants/Colors";
import { Category } from "@/types/product";
import { updateCategory, createCategory } from "@/services/product";

type Props = {
  visible: boolean;
  category?: Category | null;
  onClose: () => void;
  onSaved?: () => void;
  parentId?: string | null;
};

export default function CategoryEditModal({
  visible,
  category,
  onClose,
  onSaved,
  parentId,
}: Props) {
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [imageUrl, setImageUrl] = useState(category?.imageUrl || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(category?.name || "");
    setSlug(category?.slug || "");
    setImageUrl(category?.imageUrl || "");
  }, [category]);

  const handleSave = async () => {
    try {
      setSaving(true);
      if (category) {
        await updateCategory(category.slug, { name, slug, imageUrl });
      } else {
        await createCategory({ name, slug, imageUrl }, parentId);
      }
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {category ? "Edit Category" : "Add Category"}
            </Text>
          </View>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Name"
            label="Name"
          />
          <Input
            value={slug}
            onChangeText={setSlug}
            placeholder="Slug"
            label="Slug"
          />
          <Input
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Image URL"
            label="Image URL"
          />
          <View style={styles.actions}>
            <Button
              title="Cancel"
              type="default"
              color={Colors.textSecondary}
              onPress={onClose}
              disabled={saving}
            />
            <Button title="Save" onPress={handleSave} disabled={saving} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
