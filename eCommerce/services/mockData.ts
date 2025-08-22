import { Product } from '@/types/product';



// PROMO BANNERS
export const mockPromoBanners = [
  {
    id: "1",
    title: "Big Sale",
    subtitle: "Up to 50%",
    discount: "Happening now!",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
    backgroundColor: "#FFB800",
  },
  {
    id: "2",
    title: "New Collection",
    subtitle: "Summer 2024",
    discount: "Shop now",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
    backgroundColor: "#FF6B6B",
  },
  {
    id: "3",
    title: "Flash Sale",
    subtitle: "Limited Time",
    discount: "24h only!",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=200&fit=crop",
    backgroundColor: "#4ECDC4",
  }
];

// CATEGORIES
export const mockCategories = [
  {
    id: "1",
    title: "Clothing",
    subtitle: "Latest trends",
    count: 109,
    slug: "clothing",
    imageUrls: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    backgroundColor: "#E8D5F2",
  },
  {
    id: "2",
    title: "Shoes",
    subtitle: "Comfort & style",
    count: 530,
    slug: "shoes",
    imageUrls: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&h=100&fit=crop"
    ],
    backgroundColor: "#FFE5D9",
  },
  {
    id: "3",
    title: "Bags",
    subtitle: "Carry in style",
    count: 87,
    slug: "bags",
    imageUrls: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=100&h=100&fit=crop"
    ],
    backgroundColor: "#FFF2CC",
  },
  {
    id: "4",
    title: "Lingerie",
    subtitle: "Comfort first",
    count: 218,
    slug: "lingerie",
    imageUrls: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop"
    ],
    backgroundColor: "#F0E6FF",
  },
  {
    id: "5",
    title: "Watches",
    subtitle: "Time in style",
    count: 156,
    slug: "watches",
    imageUrls: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    backgroundColor: "#E8F5E8",
  },
];

// SEARCH DATA
export const mockSearchHistory = [];
export const mockRecommendations = [];

// HIERARCHICAL CATEGORIES FOR FILTERS
export const mockFilterCategories = [
  {
    id: 'clothing',
    name: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=50&h=50&fit=crop',
    subcategories: [
      { id: 'dresses', name: 'Dresses', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=50&h=50&fit=crop' },
      { id: 'pants', name: 'Pants', imageUrl: 'https://images.unsplash.com/photo-1542272454315-7ad85f8f6c6f?w=50&h=50&fit=crop' },
      { id: 'shirts', name: 'Shirts', imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=50&h=50&fit=crop' },
      { id: 'shorts', name: 'Shorts', imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=50&h=50&fit=crop' },
      { id: 'jackets', name: 'Jackets', imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=50&h=50&fit=crop' },
      { id: 'tshirts', name: 'T-shirts', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop' },
      { id: 'accessories', name: 'Accessories', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop' },
      { id: 'watches', name: 'Watches', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&h=50&fit=crop' },
    ]
  },
  {
    id: 'shoes',
    name: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=50&h=50&fit=crop',
    subcategories: [
      { id: 'sneakers', name: 'Sneakers', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=50&h=50&fit=crop' },
      { id: 'boots', name: 'Boots', imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=50&h=50&fit=crop' },
      { id: 'sandals', name: 'Sandals', imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=50&h=50&fit=crop' },
      { id: 'heels', name: 'Heels', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=50&h=50&fit=crop' },
      { id: 'athletic', name: 'Athletic', imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=50&h=50&fit=crop' },
    ]
  },
  {
    id: 'bags',
    name: 'Bags',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop',
    subcategories: [
      { id: 'handbags', name: 'Handbags', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=50&h=50&fit=crop' },
      { id: 'backpacks', name: 'Backpacks', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50&h=50&fit=crop' },
      { id: 'crossbody', name: 'Crossbody', imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=50&h=50&fit=crop' },
      { id: 'totes', name: 'Totes', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=50&h=50&fit=crop' },
    ]
  },
  {
    id: 'lingerie',
    name: 'Lingerie',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=50&h=50&fit=crop',
    subcategories: [
      { id: 'bras', name: 'Bras', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=50&h=50&fit=crop' },
      { id: 'underwear', name: 'Underwear', imageUrl: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=50&h=50&fit=crop' },
      { id: 'sleepwear', name: 'Sleepwear', imageUrl: 'https://images.unsplash.com/photo-1571071854326-092d4f7d90b8?w=50&h=50&fit=crop' },
      { id: 'loungewear', name: 'Loungewear', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4c3ea5e2?w=50&h=50&fit=crop' },
    ]
  }
];
// SIZES AND COLORS
export const mockClothingSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
export const mockShoeSizes = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];
export const mockSizes = mockClothingSizes;
export const mockColors = [
  { id: 'blue', color: '#007AFF' },
  { id: 'red', color: '#FF3B30' },
  { id: 'green', color: '#34C759' },
  { id: 'yellow', color: '#FFCC00' },
  { id: 'purple', color: '#AF52DE' },
  { id: 'orange', color: '#FF9500' },
  { id: 'pink', color: '#FF2D92' },
  { id: 'brown', color: '#A2845E' },
  { id: 'black', color: '#000000' },
  { id: 'white', color: '#FFFFFF' }
];

// SORT OPTIONS
export const mockSortOptions = [
  { id: 'popular', label: 'Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' }
];

// SPECIFICATIONS
export const mockSpecifications = [
  { label: 'Material', value: 'Cotton 95%, Nylon 5%' },
  { label: 'Origin', value: 'EU' }
];

// DELIVERY OPTIONS
export const mockDeliveryOptions = [
  { type: 'Standard', duration: '5-7 days', price: '$3.00' },
  { type: 'Express', duration: '1-2 days', price: '$12.00' }
];



export const getMockPromoBanners = () => mockPromoBanners;

export const getMockCategories = () => mockCategories;

export const getMockSearchHistory = () => mockSearchHistory;

export const getMockRecommendations = () => mockRecommendations;

export const getMockFilterData = () => ({
  categories: mockFilterCategories,
  sizes: mockClothingSizes,
  colors: mockColors,
  sortOptions: mockSortOptions
});

export const getMockSpecifications = () => mockSpecifications;

export const getMockDeliveryOptions = () => mockDeliveryOptions;

export const FLASH_SALE_CONFIG = {
  isActive: true,
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
  products: ['1', '3', '4', '6'],
  title: 'Flash Sale - Limited Time!',
  description: 'Up to 45% off selected items'
};

export const getFlashSaleEndTime = () => FLASH_SALE_CONFIG.endTime;
export const isFlashSaleActive = (product: Product) => FLASH_SALE_CONFIG.isActive && FLASH_SALE_CONFIG.products.includes(product.id);
export const getFlashSaleDiscount = (product: Product) => {
  if (!isFlashSaleActive(product)) return 0;
  
  const discountMap: Record<string, number> = {
    '1': 40, 
    '3': 35, 
    '4': 45,
    '6': 30 
  };
  
  return discountMap[product.id] || 0;
};

export const getFlashSaleInfo = () => ({
  isActive: FLASH_SALE_CONFIG.isActive,
  endTime: FLASH_SALE_CONFIG.endTime,
  title: FLASH_SALE_CONFIG.title,
  description: FLASH_SALE_CONFIG.description,
  productCount: FLASH_SALE_CONFIG.products.length,
  maxDiscount: Math.max(...FLASH_SALE_CONFIG.products.map(id => getFlashSaleDiscount({ id } as Product)))
});

export const getFlashSaleTimeRemaining = () => {
  const now = new Date().getTime();
  const endTime = FLASH_SALE_CONFIG.endTime.getTime();
  const timeLeft = endTime - now;
  
  if (timeLeft <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};
