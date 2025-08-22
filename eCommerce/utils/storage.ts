import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@DuyuBox_Cart';


// INFO: Save item
export const saveItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`@DuyuBox_${key}`, jsonValue);
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// INFO: Load item
export const loadItem = async (key: string): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`@DuyuBox_${key}`);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return null;
  }
};

// INFO: Remove item
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`@DuyuBox_${key}`);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
  }
};

// INFO: Async cart funcs
export const CartStorage = {
  async saveCart(cart: any): Promise<void> {
    try {
      const cartJson = JSON.stringify(cart);
      await AsyncStorage.setItem(CART_STORAGE_KEY, cartJson);
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  },

  async loadCart(): Promise<any | null> {
    try {
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return cartJson ? JSON.parse(cartJson) : null;
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return null;
    }
  },

  async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from storage:', error);
    }
  }
};