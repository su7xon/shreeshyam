'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

// ==================== Types ====================

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
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
  reorderBanners: (bannerIds: string[]) => void;

  // Offers
  offers: Offer[];
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;

  // Site config
  siteName: string;
  setSiteName: (name: string) => void;
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
    rating: 4.8,
    reviews: 1250,
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
    rating: 4.7,
    reviews: 980,
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
    rating: 4.6,
    reviews: 650,
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
    rating: 4.5,
    reviews: 820,
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
    rating: 4.4,
    reviews: 410,
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
    rating: 4.3,
    reviews: 560,
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
    rating: 4.5,
    reviews: 320,
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
    rating: 4.7,
    reviews: 2100,
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
    order: 0,
    active: true,
  },
];

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
        set((state) => ({ banners: [...state.banners, banner].sort((a, b) => a.order - b.order) })),
      updateBanner: (id, updates) =>
        set((state) => ({
          banners: state.banners.map((b) => (b.id === id ? { ...b, ...updates } : b)).sort((a, b) => a.order - b.order),
        })),
      deleteBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        })),
      reorderBanners: (bannerIds) =>
        set((state) => ({
          banners: bannerIds
            .map((id, index) => state.banners.find((b) => b.id === id)!)
            .filter(Boolean)
            .map((b, index) => ({ ...b, order: index })),
        })),

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
    }),
    {
      name: 'mobimart-admin-store',
    }
  )
);

export default useAdminStore;
