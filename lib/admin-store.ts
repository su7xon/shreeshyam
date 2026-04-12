'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

// ==================== Types ====================

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const BANNER_PLACEMENTS = ['hero', 'small-cards', 'trending', 'before-about'] as const;
export type BannerPlacement = (typeof BANNER_PLACEMENTS)[number];

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: 'card' | 'upi' | 'cod';
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  placement: BannerPlacement;
  order: number;
  active: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  icon?: string;
  active: boolean;
}

export interface SiteConfig {
  heroBanners: Banner[];
  offers: Offer[];
}

export interface AdminProduct extends Product {
  colors?: string[];
  offers?: string[]; // Offer IDs
}

interface AdminStore {
  // Products
  products: AdminProduct[];
  addProduct: (product: AdminProduct) => void;
  updateProduct: (id: string, product: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => AdminProduct | undefined;

  // Banners
  banners: Banner[];
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (placement: BannerPlacement, bannerIds: string[]) => void;

  // Offers
  offers: Offer[];
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;

   // Site config
   siteName: string;
   setSiteName: (name: string) => void;

   // Brands
   brands: Brand[];
   addBrand: (brand: Brand) => void;
   updateBrand: (id: string, brand: Partial<Brand>) => void;
   deleteBrand: (id: string) => void;
   getBrand: (id: string) => Brand | undefined;

   // Orders
   orders: Order[];
   addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
   updateOrderStatus: (orderId: string, status: OrderStatus) => void;
   deleteOrder: (orderId: string) => void;
   getOrder: (orderId: string) => Order | undefined;
}

// ==================== Default Data ====================

const defaultProducts: AdminProduct[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 159900,
    originalPrice: 169900,
    image: "https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg",
    ram: "8GB",
    storage: "256GB",
    processor: "A17 Pro",
    battery: "4422 mAh",
    camera: "48MP + 12MP + 12MP",
    display: "6.7 inch Super Retina XDR OLED",
    featured: true,
    description: "The iPhone 15 Pro Max features a strong and lightweight titanium design, the powerful A17 Pro chip, and a pro camera system with a 5x Telephoto lens.",
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    offers: [],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 129999,
    originalPrice: 139999,
    image: "https://m.media-amazon.com/images/I/71CXhVhpM0L._SX679_.jpg",
    ram: "12GB",
    storage: "512GB",
    processor: "Snapdragon 8 Gen 3",
    battery: "5000 mAh",
    camera: "200MP + 50MP + 12MP + 10MP",
    display: "6.8 inch Dynamic AMOLED 2X",
    featured: true,
    description: "Galaxy S24 Ultra is the ultimate Galaxy experience, featuring a titanium exterior, a flat display, and the power of Galaxy AI.",
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
    offers: [],
  },
  {
    id: "3",
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 106999,
    image: "https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg",
    ram: "12GB",
    storage: "128GB",
    processor: "Google Tensor G3",
    battery: "5050 mAh",
    camera: "50MP + 48MP + 48MP",
    display: "6.7 inch Super Actua OLED",
    featured: true,
    description: "Pixel 8 Pro is the all-pro engineered by Google. It has a sleek design, powerful performance, and the best Pixel camera yet.",
    colors: ["Obsidian", "Porcelain", "Bay"],
    offers: [],
  },
  {
    id: "4",
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 64999,
    originalPrice: 69999,
    image: "https://m.media-amazon.com/images/I/717Qo4MH97L._SX679_.jpg",
    ram: "12GB",
    storage: "256GB",
    processor: "Snapdragon 8 Gen 3",
    battery: "5400 mAh",
    camera: "50MP + 64MP + 48MP",
    display: "6.82 inch ProXDR AMOLED",
    description: "The OnePlus 12 delivers a fast and smooth experience with its powerful processor, advanced cooling system, and ultra-fast charging.",
    colors: ["Flowy Emerald", "Silky Black"],
    offers: [],
  },
  {
    id: "5",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 99999,
    image: "https://m.media-amazon.com/images/I/71CXhVhpM0L._SX679_.jpg",
    ram: "16GB",
    storage: "512GB",
    processor: "Snapdragon 8 Gen 3",
    battery: "5000 mAh",
    camera: "50MP + 50MP + 50MP + 50MP",
    display: "6.73 inch LTPO AMOLED",
    description: "Xiaomi 14 Ultra brings a professional photography experience with its Leica optics and powerful performance.",
    colors: ["Black", "White"],
    offers: [],
  },
  {
    id: "6",
    name: "Nothing Phone (2)",
    brand: "Nothing",
    price: 39999,
    originalPrice: 44999,
    image: "https://m.media-amazon.com/images/I/717Qo4MH97L._SX679_.jpg",
    ram: "8GB",
    storage: "128GB",
    processor: "Snapdragon 8+ Gen 1",
    battery: "4700 mAh",
    camera: "50MP + 50MP",
    display: "6.7 inch LTPO OLED",
    description: "Nothing Phone (2) features a unique transparent design, the Glyph Interface, and a clean Nothing OS experience.",
    colors: ["White", "Dark Grey"],
    offers: [],
  },
  {
    id: "7",
    name: "Vivo X100 Pro",
    brand: "Vivo",
    price: 89999,
    image: "https://m.media-amazon.com/images/I/61cwywLZR-L._SX679_.jpg",
    ram: "16GB",
    storage: "512GB",
    processor: "Dimensity 9300",
    battery: "5400 mAh",
    camera: "50MP + 50MP + 50MP",
    display: "6.78 inch LTPO AMOLED",
    description: "Vivo X100 Pro offers exceptional camera capabilities co-engineered with ZEISS, along with top-tier performance.",
    colors: ["Asteroid Black", "Meteor Blue"],
    offers: [],
  },
  {
    id: "8",
    name: "iPhone 15",
    brand: "Apple",
    price: 79900,
    image: "https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg",
    ram: "6GB",
    storage: "128GB",
    processor: "A16 Bionic",
    battery: "3349 mAh",
    camera: "48MP + 12MP",
    display: "6.1 inch Super Retina XDR OLED",
    featured: true,
    description: "iPhone 15 brings the Dynamic Island, a 48MP Main camera, and USB-C to a beautiful, durable design.",
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    offers: [],
  },
];

const defaultBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Samsung Galaxy S25 Ultra",
    subtitle: "The ultimate Galaxy AI experience",
    image: "/samsung-s25-hero-2.jpeg",
    link: "/products/2",
    placement: 'hero',
    order: 0,
    active: true,
  },
];

const bannerSort = (a: Banner, b: Banner) => {
  if (a.placement === b.placement) return a.order - b.order;
  return a.placement.localeCompare(b.placement);
};

const normalizeBanner = (banner: Partial<Banner> & Pick<Banner, 'id' | 'title' | 'image' | 'order' | 'active'>): Banner => ({
  ...banner,
  subtitle: banner.subtitle || '',
  link: banner.link || '',
  placement: (banner.placement || 'hero') as BannerPlacement,
});

const defaultOffers: Offer[] = [
  {
    id: "offer-1",
    title: "HDFC Bank Offer",
    description: "10% instant discount up to ₹7,500 on HDFC Bank Credit Card EMI Transactions.",
    icon: "🏦",
    active: true,
  },
  {
    id: "offer-2",
    title: "No Cost EMI",
    description: "No Cost EMI available on select credit cards. View details.",
    icon: "💳",
    active: true,
  },
  {
    id: "offer-3",
    title: "Exchange Offer",
    description: "Save up to ₹20,000 when you exchange your old phone.",
    icon: "🔄",
    active: true,
  },
];

const defaultBrands: Brand[] = [
  { id: "brand-apple", name: "Apple", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-samsung", name: "Samsung", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-google", name: "Google", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-oneplus", name: "OnePlus", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-xiaomi", name: "Xiaomi", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-nothing", name: "Nothing", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-vivo", name: "Vivo", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-realme", name: "Realme", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-motorola", name: "Motorola", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-iqoo", name: "iQOO", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-poco", name: "Poco", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "brand-oppo", name: "Oppo", active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ==================== Store ====================

const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Products
      products: defaultProducts,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      getProduct: (id) => get().products.find((p) => p.id === id),

      // Banners
      banners: defaultBanners,
      addBanner: (banner) =>
        set((state) => {
          const nextBanner = normalizeBanner(banner);
          const nextBanners =
            nextBanner.placement === 'before-about' && nextBanner.active
              ? state.banners.map((b) =>
                  b.placement === 'before-about' ? { ...b, active: false } : b
                )
              : state.banners;

          return { banners: [...nextBanners, nextBanner].sort(bannerSort) };
        }),
      updateBanner: (id, updates) =>
        set((state) => {
          const current = state.banners.find((b) => b.id === id);
          if (!current) return { banners: state.banners };

          const updated = normalizeBanner({ ...current, ...updates });
          const shouldActivateExclusiveBeforeAbout =
            updated.placement === 'before-about' && updated.active;

          const nextBanners = state.banners.map((b) => {
            if (b.id === id) return updated;
            if (shouldActivateExclusiveBeforeAbout && b.placement === 'before-about') {
              return { ...b, active: false };
            }
            return b;
          });

          return { banners: nextBanners.sort(bannerSort) };
        }),
      deleteBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        })),
      reorderBanners: (placement, bannerIds) =>
        set((state) => {
          const untouched = state.banners.filter((b) => b.placement !== placement);
          const reordered = bannerIds
            .map((id) => state.banners.find((b) => b.id === id && b.placement === placement))
            .filter(Boolean)
            .map((b, index) => ({ ...(b as Banner), order: index }));

          return {
            banners: [...untouched, ...reordered].sort(bannerSort),
          };
        }),

      // Offers
      offers: defaultOffers,
      addOffer: (offer) => set((state) => ({ offers: [...state.offers, offer] })),
      updateOffer: (id, updates) =>
        set((state) => ({
          offers: state.offers.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        })),
      deleteOffer: (id) =>
        set((state) => ({
          offers: state.offers.filter((o) => o.id !== id),
        })),

       // Site config
       siteName: "श्री श्याम Mobiles",
       setSiteName: (name) => set({ siteName: name }),

       // Brands
       brands: defaultBrands,
       addBrand: (brand) =>
         set((state) => ({ brands: [...state.brands, brand] })),
       updateBrand: (id, updates) =>
         set((state) => ({
           brands: state.brands.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)),
         })),
       deleteBrand: (id) =>
         set((state) => ({
           brands: state.brands.filter((b) => b.id !== id),
         })),
       getBrand: (id) => get().brands.find((b) => b.id === id),

       // Orders
       orders: [],
       addOrder: (orderData) =>
         set((state) => {
           const now = new Date().toISOString();
           const order: Order = {
             ...orderData,
             id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
             createdAt: now,
             updatedAt: now,
           };
           return { orders: [order, ...state.orders] };
         }),
       updateOrderStatus: (orderId, status) =>
         set((state) => ({
           orders: state.orders.map((o) =>
             o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
           ),
         })),
       deleteOrder: (orderId) =>
         set((state) => ({
           orders: state.orders.filter((o) => o.id !== orderId),
         })),
       getOrder: (orderId) => get().orders.find((o) => o.id === orderId),
    }),
    {
      name: 'mobimart-admin-store',
      merge: (persistedState, currentState) => {
        const persisted = (persistedState || {}) as Partial<AdminStore>;
        const persistedBanners = Array.isArray(persisted.banners)
          ? persisted.banners.map((banner) =>
              normalizeBanner(
                banner as Partial<Banner> & Pick<Banner, 'id' | 'title' | 'image' | 'order' | 'active'>
              )
            )
          : currentState.banners;

        const persistedBrands = Array.isArray(persisted.brands)
          ? persisted.brands
          : currentState.brands;

        return {
          ...currentState,
          ...persisted,
          banners: persistedBanners,
          brands: persistedBrands,
        };
      },
    }
  )
);

export default useAdminStore;

