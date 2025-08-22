import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/atoms/Text";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Colors } from "@/constants/Colors";
import { Product, Category } from "@/types/product";
import { apiPut, apiPost, apiPatch } from "@/services/api";
import { getCategories, getSubcategories } from "@/services/product";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  product?: Product | null;
  onClose: () => void;
  onSaved?: () => void;
};

export default function ProductEditModal({
  visible,
  product,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState(String(product?.originalPrice ?? product?.price ?? ""));
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || "");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySlug, setCategorySlug] = useState(
    product?.category.slug || ""
  );
  const [subcategorySlug, setSubcategorySlug] = useState(
    product?.subcategory?.slug || ""
  );
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(() => {
    const imgs = Array.isArray(product?.images)
      ? (product?.images as string[])
      : product?.images
      ? [String(product.images)]
      : [];
    return imgs.length > 0 ? imgs : [""];
  });
  const [discountPercent, setDiscountPercent] = useState(
    String(product?.discount ?? "")
  );

  useEffect(() => {
    setName(product?.name || "");
    setSlug(product?.slug || "");
    setPrice(String(product?.originalPrice ?? product?.price ?? ""));
    setDiscountPercent(String(product?.discount ?? ""));
    setImageUrl(product?.images?.[0] || "");
    setCategorySlug(product?.category.slug || "");
    setSubcategorySlug(product?.subcategory?.slug || "");
    const imgs = product?.images && Array.isArray(product.images) ? (product.images as string[]) : [];
    setImages(imgs.length > 0 ? imgs : [""]);
  }, [product]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!categorySlug) {
        setSubcategories([]);
        return;
      }
      const subs = await getSubcategories(categorySlug);
      setSubcategories(subs);
    })();
  }, [categorySlug]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const selectedCategory = categories.find(c => c.slug === categorySlug) || product?.category;
      const selectedSub = subcategories.find(s => s.slug === subcategorySlug) || product?.subcategory || null;

      const originalSlug = product?.slug;
      const effectiveSlug = product ? (originalSlug || slug) : slug;
      const payload = {
        name,
        slug: effectiveSlug,
        categoryId: selectedCategory?.id,
        subcategoryId: selectedSub?.id,
        price: Number(price), // This will be treated as originalPrice by backend
        originalPrice: Number(price), // Explicitly set originalPrice
        discountPercent: discountPercent ? Number(discountPercent) : null,
        rating: product?.rating ?? 0,
        description: (product?.description ?? '').trim(),
        imageUrl: images[0] || null,
        variants: [] as { name: string; values: string[] }[],
        options: [] as { name: string; value: string }[],
        reviews: [] as { author: string; rating: number; comment: string; date: string }[],
      };

      if (product && product.id) {
        await apiPut(`/products/${product.id}`, payload);
        await apiPatch(`/products/${product.id}/images`, { imageUrl: images[0] || null, images });
      } else {
        const created = await apiPost<{ id: string }>(`/products`, { ...payload, images });
        const newId = (created as any)?.id;
        if (newId) {
          await apiPatch(`/products/${newId}/images`, { imageUrl: images[0] || null, images });
        }
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
          <Text style={styles.title}>
            {product ? "Edit Product" : "Add Product"}
          </Text>
          <ScrollView contentContainerStyle={{ gap: 12 }}>
            <Input value={name} onChangeText={setName} placeholder="Name" label="Name" />
            <Input value={slug} onChangeText={setSlug} placeholder="Slug" label="Slug" />
                          <Input
                value={price}
                onChangeText={setPrice}
                placeholder="Base Price"
                keyboardType="numeric"
                label="Base Price"
              />
            <Input
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="Preview Image URL"
              label="Preview Image URL"
            />
            <Input
              value={discountPercent}
              onChangeText={setDiscountPercent}
              placeholder="Discount %"
              keyboardType="numeric"
              label="Discount %"
            />
            {discountPercent && Number(discountPercent) > 0 && price && Number(price) > 0 && (
              <View style={styles.pricePreview}>
                <Text style={styles.pricePreviewText}>
                  Final Price: ${(Number(price) * (1 - Number(discountPercent) / 100)).toFixed(2)}
                </Text>
              </View>
            )}
            {/* Flash sale toggle omitted from request; backend manages */}
            <Text style={styles.label}>Category</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {categories.map((c) => (
                <Button
                  key={c.slug}
                  title={c.name}
                  type={categorySlug === c.slug ? "chip" : "chip"}
                  selected={categorySlug === c.slug}
                  onPress={() => setCategorySlug(c.slug)}
                />
              ))}
            </View>
            {categorySlug ? (
              <>
                <Text style={styles.label}>Subcategory</Text>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {subcategories.map((s) => (
                    <Button
                      key={s.slug}
                      title={s.name}
                      type="chip"
                      selected={subcategorySlug === s.slug}
                      onPress={() => setSubcategorySlug(s.slug)}
                    />
                  ))}
                </View>
              </>
            ) : null}
            <Text style={styles.label}>Images</Text>
            <Text style={styles.label}>{images.length} images</Text>
            {images.map((img, idx) => (
              <Input
                key={idx}
                label={`Image URL #${idx + 1}`}
                value={img}
                onChangeText={(t) =>
                  setImages((prev) => prev.map((p, i) => (i === idx ? t : p)))
                }
                placeholder={`Image URL #${idx + 1}`}
              />
            ))}
            <TouchableOpacity onPress={() => setImages((prev) => [...prev, ""])}>
              <MaterialIcons
                name="add"
                size={24}
                color={Colors.tabIconSelected}
              />
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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
  label: {
    color: Colors.textSecondary,
  },
  pricePreview: {
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  pricePreviewText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
});
