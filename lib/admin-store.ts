'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';
import { expandedProducts } from './expanded-catalog';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import * as productService from './services/productService';
import * as brandService from './services/brandService';
import * as bannerService from './services/bannerService';
import * as offerService from './services/offerService';
import * as orderService from './services/orderService';
import * as categoryService from './services/categoryService';
import * as dailyDealService from './services/dailyDealService';
import * as reviewService from './services/reviewService';
import { Review } from './services/reviewService';

// ==================== Types ====================

export interface Category {
  id: string;
  name: string;
  image: string;
  active: boolean;
  order: number;
}

export interface DailyDeal {
  id: string;
  productId: string;
  active: boolean;
  order: number;
}

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
  paymentMethod: 'card' | 'upi' | 'cod' | 'whatsapp';
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
  addProduct: (product: Omit<AdminProduct, 'id'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => AdminProduct | undefined;
  importBulkProducts: (products: Omit<AdminProduct, 'id'>[]) => Promise<void>;

  // Banners
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<string>;
  updateBanner: (id: string, banner: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  reorderBanners: (placement: BannerPlacement, bannerIds: string[]) => Promise<void>;

  // Offers
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<string>;
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;

  // Daily Deals
  dailyDeals: DailyDeal[];
  addDailyDeal: (deal: Omit<DailyDeal, 'id'>) => Promise<string>;
  updateDailyDeal: (id: string, deal: Partial<DailyDeal>) => Promise<void>;
  deleteDailyDeal: (id: string) => Promise<void>;

   // Site config
   siteName: string;
   setSiteName: (name: string) => void;

   // Brands
   brands: Brand[];
   addBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
   updateBrand: (id: string, brand: Partial<Brand>) => Promise<void>;
   deleteBrand: (id: string) => Promise<void>;
   getBrand: (id: string) => Brand | undefined;

    // Orders
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;
    getOrder: (orderId: string) => Order | undefined;

    // Reviews
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<string>;
    updateReviewStatus: (reviewId: string, status: 'approved' | 'rejected') => Promise<void>;
    deleteReview: (reviewId: string) => Promise<void>;

    // Firebase Sync
    isLoading: boolean;
    isInitialized: boolean;
    initialize: () => (() => void);
}

// ==================== Default Data ====================

// Default data is now only used as a very first initial state before hydration or sync
const defaultProducts: AdminProduct[] = [];
const defaultBanners: Banner[] = [];
const defaultOffers: Offer[] = [];
const defaultBrands: Brand[] = [];
const defaultCategories: Category[] = [];

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

// ==================== Store ====================

const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Products
      products: [],
      addProduct: async (product) => {
        const id = await productService.createProduct(product as any);
        return id;
      },
      updateProduct: async (id, updates) => {
        await productService.updateProduct(id, updates as any);
      },
      deleteProduct: async (id) => {
        await productService.deleteProduct(id);
      },
      getProduct: (id) => get().products.find((p) => p.id === id),
      importBulkProducts: async (products) => {
        await productService.createProductsBulk(products as any);
      },

      // Banners
      banners: [],
      addBanner: async (banner) => {
        const id = await bannerService.createBanner(banner as any);
        return id;
      },
      updateBanner: async (id, updates) => {
        await bannerService.updateBanner(id, updates as any);
      },
      deleteBanner: async (id) => {
        await bannerService.deleteBanner(id);
      },
      reorderBanners: async (placement, bannerIds) => {
        const bannerUpdates = bannerIds.map((id, index) => 
          bannerService.updateBanner(id, { order: index } as any)
        );
        await Promise.all(bannerUpdates);
      },

      // Offers
      offers: [],
      addOffer: async (offer) => {
        const id = await offerService.createOffer(offer as any);
        return id;
      },
      updateOffer: async (id, updates) => {
        await offerService.updateOffer(id, updates as any);
      },
      deleteOffer: async (id) => {
        await offerService.deleteOffer(id);
      },

      // Categories
      categories: [],
      addCategory: async (category) => {
        const id = await categoryService.createCategory(category as any);
        return id;
      },
      updateCategory: async (id, updates) => {
        await categoryService.updateCategory(id, updates as any);
      },
      deleteCategory: async (id) => {
        await categoryService.deleteCategory(id);
      },
      reorderCategories: async (categoryIds) => {
        const categoryUpdates = categoryIds.map((id, index) => 
          categoryService.updateCategory(id, { order: index } as any)
        );
        await Promise.all(categoryUpdates);
      },

      // Daily Deals
      dailyDeals: [],
      addDailyDeal: async (deal) => {
        const id = await dailyDealService.createDailyDeal(deal);
        return id;
      },
      updateDailyDeal: async (id, updates) => {
        await dailyDealService.updateDailyDeal(id, updates);
      },
      deleteDailyDeal: async (id) => {
        await dailyDealService.deleteDailyDeal(id);
      },

       // Site config
       siteName: "श्री श्याम Mobiles",
       setSiteName: (name) => set({ siteName: name }),

       // Brands
       brands: [],
       addBrand: async (brand) => {
         const id = await brandService.createBrand(brand as any);
         return id;
       },
       updateBrand: async (id, updates) => {
         await brandService.updateBrand(id, updates as any);
       },
       deleteBrand: async (id) => {
         await brandService.deleteBrand(id);
       },
       getBrand: (id) => get().brands.find((b) => b.id === id),

       // Firebase Sync
       isLoading: false,
       isInitialized: false,
       initialize: () => {
         if (get().isInitialized || !db) return () => {};
         
         set({ isLoading: true, isInitialized: true });
         
         // Setup real-time listeners for all main collections
         const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
           const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminProduct[];
           set({ products, isLoading: false });
         });

         const unsubBrands = onSnapshot(collection(db, 'brands'), (snapshot) => {
           const brands = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Brand[];
           set({ brands });
         });

         const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
           const banners = snapshot.docs
             .map((doc) => normalizeBanner({ ...doc.data(), id: doc.id } as any))
             .sort(bannerSort);
           set({ banners });
         });

         const unsubOffers = onSnapshot(collection(db, 'offers'), (snapshot) => {
           const offers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Offer[];
           set({ offers });
         });

         const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
           const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
           set({ orders });
         });

         const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('order', 'asc')), (snapshot) => {
           const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
           set({ categories });
         });

         const unsubDeals = onSnapshot(collection(db, 'dailyDeals'), (snapshot) => {
           const dailyDeals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DailyDeal[];
           set({ dailyDeals });
         });

         const unsubReviews = onSnapshot(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')), (snapshot) => {
           const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
           set({ reviews });
         });

         // Return combined unsubscribe
         return () => {
           unsubProducts();
           unsubBrands();
           unsubBanners();
           unsubOffers();
           unsubOrders();
           unsubCategories();
           unsubDeals();
           unsubReviews();
           set({ isInitialized: false });
         };
       },

       // Orders
       orders: [],
       addOrder: async (orderData) => {
         const id = await orderService.createOrder(orderData as any);
         return id;
       },
       updateOrderStatus: async (orderId, status) => {
         await orderService.updateOrderStatus(orderId, status);
       },
       deleteOrder: async (orderId) => {
         await orderService.deleteOrder(orderId);
       },
       getOrder: (orderId) => get().orders.find((o) => o.id === orderId),

       // Reviews
       reviews: [],
       addReview: async (reviewData) => {
         const id = await reviewService.addReview(reviewData);
         return id;
       },
       updateReviewStatus: async (reviewId, status) => {
         await reviewService.updateReviewStatus(reviewId, status);
       },
       deleteReview: async (reviewId) => {
         await reviewService.deleteReview(reviewId);
       },
    }),
    {
      name: 'mobimart-admin-store',
      // Only persist lightweight config data, NOT large datasets
      // Products (can be 2-3MB for 500+ items) are fetched fresh via React Query
      partialize: (state) => ({
        banners: state.banners,
        offers: state.offers,
        brands: state.brands,
        categories: state.categories,
        siteName: state.siteName,
        // Excluded: products, orders, dailyDeals, isLoading
      }),
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

        const persistedCategories = Array.isArray(persisted.categories)
          ? persisted.categories
          : currentState.categories;

        return {
          ...currentState,
          ...persisted,
          banners: persistedBanners,
          brands: persistedBrands,
          categories: persistedCategories,
          isLoading: false,
        };
      },
    }
  )
);

export default useAdminStore;

