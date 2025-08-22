import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import Checkbox from '@/components/atoms/Checkbox';

import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/atoms/Icon";
import Button from "@/components/atoms/Button";
import FilterChip from "@/components/molecules/FilterChip";
import { Accordion, AccordionItem } from "@/components/molecules/Accordion";
import FilterCategoryItem from "@/components/molecules/FilterCategoryItem";
import FilterSubcategoryItem from "@/components/molecules/FilterSubcategoryItem";

import { getMockFilterData, mockClothingSizes, mockShoeSizes } from "@/services/mockData"; // TODO: Remove this after backend is implemented

import { Colors } from "@/constants/Colors";

interface FilterOption {
  id: string;
  name: string;
  imageUrl?: string;
  selected?: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  preSelectedCategory?: string;
  isCategoryScreen?: boolean;
  initialFilters?: {
    categories?: string[];
    subcategories?: string[];
    sizes?: string[];
    colors?: string[];
    priceRange?: [number, number];
    sortBy?: string;
  };
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  preSelectedCategory,
  isCategoryScreen = false,
  initialFilters,
}) => {

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (preSelectedCategory) return [preSelectedCategory];
    return initialFilters?.categories || [];
  });

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    initialFilters?.subcategories || []
  );

  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    if (preSelectedCategory) return [preSelectedCategory];
    return [];
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialFilters?.sizes || []
  );

  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialFilters?.colors || []
  );

  const [priceRange, setPriceRange] = useState(
    initialFilters?.priceRange || [0, 500]
  );

  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || "popular");

  const [sizeType, setSizeType] = useState<'clothing' | 'shoes'>('clothing');

  const filterData = getMockFilterData();

  const { categories, sizes, colors, sortOptions } = filterData;

  // INFO: Auto-switch size type based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const hasShoes = selectedCategories.some(cat => cat === 'shoes');
      const hasClothing = selectedCategories.some(cat => cat === 'clothing');
      
      if (hasShoes && !hasClothing) {
        setSizeType('shoes');
      } else if (hasClothing && !hasShoes) {
        setSizeType('clothing');
      }
    }
  }, [selectedCategories]);


  const toggleCategory = (categoryId: string) => {
    if (
      categoryId === preSelectedCategory &&
      selectedCategories.includes(categoryId)
    ) {
      return;
    }

    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleSizeType = (type: 'clothing' | 'shoes') => {
    setSizeType(type);
    setSelectedSizes([]);
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      sizes: selectedSizes,
      colors: selectedColors,
      priceRange,
      sortBy,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategories(preSelectedCategory ? [preSelectedCategory] : []);
    setSelectedSubcategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 500]);
    setSortBy("popular");
    setSizeType('clothing'); 
  };

  const renderAccordionCategories = () => {
    if (isCategoryScreen) {
      const currentCategory = categories.find((cat: any) => cat.id === preSelectedCategory);
      if (!currentCategory) return null;
      
      return (
        <View style={styles.accordionContainer}>
          <Text style={styles.sectionTitle}>Subcategories</Text>
          <View style={styles.subcategoriesContainer}>
            {currentCategory.subcategories?.map((subcategory: any) => (
              <TouchableOpacity
                key={subcategory.id}
                style={[
                  styles.subcategoryItem,
                  selectedSubcategories.includes(subcategory.id) &&
                    styles.selectedSubcategoryItem,
                ]}
                onPress={() => toggleSubcategory(subcategory.id)}
              >
                <View style={styles.subcategoryContent}>
                  <View
                    style={[
                      styles.subcategoryIndicator,
                      {
                        backgroundColor: selectedSubcategories.includes(subcategory.id)
                          ? Colors.tabIconSelected
                          : "#F0F0F0",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.subcategoryText,
                      selectedSubcategories.includes(subcategory.id) &&
                        styles.selectedSubcategoryText,
                    ]}
                  >
                    {subcategory.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    
    return (
      <Accordion style={styles.accordionContainer}>
        {categories.map((category: any) => (
          <AccordionItem
            key={category.id}
            expanded={expandedCategories.includes(category.id)}
            header={
              <FilterCategoryItem
                name={category.name}
                checked={selectedCategories.includes(category.id)}
                disabled={
                  isCategoryScreen ||
                  (category.id === preSelectedCategory && selectedCategories.includes(category.id))
                }
                expandable={!!category.subcategories?.length}
                expanded={expandedCategories.includes(category.id)}
                onToggleCheck={() => toggleCategory(category.id)}
                onToggleExpand={() => {
                  if (category.subcategories?.length > 0) toggleCategoryExpansion(category.id);
                }}
              />
            }
          >
            {category.subcategories?.length > 0 && (
              <View style={styles.subcategoriesContainer}>
                {category.subcategories.map((subcategory: any) => (
                  <FilterSubcategoryItem
                    key={subcategory.id}
                    name={subcategory.name}
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onToggle={() => toggleSubcategory(subcategory.id)}
                  />
                ))}
              </View>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>{renderAccordionCategories()}</View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    sizeType === 'clothing' && styles.activeToggle
                  ]}
                  onPress={() => toggleSizeType('clothing')}
                >
                  <Text style={[
                    styles.toggleText,
                    sizeType === 'clothing' && styles.activeToggleText
                  ]}>
                    Clothes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.toggleButton,
                    sizeType === 'shoes' && styles.activeToggle
                  ]}
                  onPress={() => toggleSizeType('shoes')}
                >
                  <Text style={[
                    styles.toggleText,
                    sizeType === 'shoes' && styles.activeToggleText
                  ]}>
                    Shoes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.sizeGrid}>
              {(sizeType === 'clothing' ? mockClothingSizes : mockShoeSizes).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeItem,
                    selectedSizes.includes(size) && styles.selectedSizeItem,
                  ]}
                  onPress={() => toggleSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSizes.includes(size) && styles.selectedSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorGrid}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color.color },
                    selectedColors.includes(color.id) &&
                      styles.selectedColorItem,
                  ]}
                  onPress={() => toggleColor(color.id)}
                >
                  {selectedColors.includes(color.id) && (
                    <Icon name="check" size={16} color={Colors.background} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price</Text>
            <Text style={styles.priceRange}>
              ${priceRange[0]} — ${priceRange[1]}
            </Text>
            <View style={styles.priceSlider}>
              <View style={styles.sliderTrack} />
              <View
                style={[styles.sliderRange, { left: "10%", right: "20%" }]}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sortGrid}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortItem,
                    sortBy === option.id && styles.selectedSortItem,
                  ]}
                  onPress={() => setSortBy(option.id)}
                >
                  <View
                    style={[
                      styles.radioButton,
                      sortBy === option.id && styles.selectedRadioButton,
                    ]}
                  >
                    {sortBy === option.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.sortText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Clear"
            onPress={handleClear}
            style={styles.clearButton}
            color={Colors.error}
          />
          <Button
            title="Apply"
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  categoryItem: {
    alignItems: "center",
    width: "18%",
  },
  categoryImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedCategoryItem: {},
  preSelectedCategoryItem: {
    opacity: 0.7,
  },
  accordionContainer: {
    gap: 8,
  },
  accordionItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },
  categoryHeader: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  selectedCategoryHeader: {
    backgroundColor: Colors.tabIconSelected + "08",
  },
  preSelectedCategoryHeader: {
    backgroundColor: Colors.tabIconSelected + "15",
  },
  categoryHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  selectedCategoryHeaderText: {
    color: Colors.tabIconSelected,
  },
  subcategoriesContainer: {
    paddingLeft: 8,
    paddingBottom: 8,
    backgroundColor: "#F8F9FA",
  },
  subcategoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  selectedSubcategoryItem: {
    backgroundColor: Colors.tabIconSelected + "08",
  },
  subcategoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subcategoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  subcategoryText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  selectedSubcategoryText: {
    color: Colors.tabIconSelected,
    fontWeight: "500",
  },
  checkmark: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.tabIconSelected,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
  },
  sizeToggle: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeToggle: {
    backgroundColor: Colors.tabIconSelected,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.tabIconDefault,
  },
  activeToggleText: {
    color: Colors.text + "55",
  },
  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sizeItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedSizeItem: {
    backgroundColor: Colors.tabIconSelected,
    borderColor: Colors.tabIconSelected,
  },
  sizeText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedSizeText: {
    color: Colors.background,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColorItem: {
    borderColor: Colors.text,
  },
  priceRange: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  priceSlider: {
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    position: "relative",
  },
  sliderTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
  },
  sliderRange: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: Colors.tabIconSelected,
    borderRadius: 2,
  },
  sortGrid: {
    gap: 16,
  },
  sortItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedSortItem: {},
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioButton: {
    borderColor: Colors.tabIconSelected,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.tabIconSelected,
  },
  sortText: {
    fontSize: 16,
    color: Colors.text,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  clearButton: {
    width: '33%'
  },
  applyButton: {
    flex:1
  },
});

export default FilterModal;
