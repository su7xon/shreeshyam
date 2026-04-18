'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';
import * as productService from './services/productService';
import * as brandService from './services/brandService';
import * as bannerService from './services/bannerService';
import * as offerService from './services/offerService';
import * as orderService from './services/orderService';

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

    // Firebase Sync
    isLoading: boolean;
    initialize: () => Promise<void>;
}

// ==================== Default Data ====================

const defaultProducts: AdminProduct[] = [];

const defaultBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Samsung Galaxy S25 Ultra",
    subtitle: "The ultimate Galaxy AI experience",
    image: "",
    link: "/products",
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

const defaultBrands: Brand[] = [];

// ==================== Store ====================

const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Products
      products: defaultProducts,
      addProduct: async (product) => {
        const id = await productService.createProduct(product as any);
        const newProduct = { ...product, id } as AdminProduct;
        set((state) => ({ products: [...state.products, newProduct] }));
        return id;
      },
      updateProduct: async (id, updates) => {
        await productService.updateProduct(id, updates as any);
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deleteProduct: async (id) => {
        await productService.deleteProduct(id);
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
      getProduct: (id) => get().products.find((p) => p.id === id),
      importBulkProducts: async (products) => {
        await productService.createProductsBulk(products as any);
        // Immediately fetch the new products from firestore to update the store
        // We will call initialize() manually in the UI component so we don't have circular dependencies here,
        // but wait, we can just fetch products here:
        const freshProducts = await productService.getProducts();
        set({ products: freshProducts });
      },

      // Banners
      banners: defaultBanners,
      addBanner: async (banner) => {
        const id = await bannerService.createBanner(banner as any);
        const nextBanner = normalizeBanner({ ...banner, id } as Banner);
        
        set((state) => {
          const nextBanners =
            nextBanner.placement === 'before-about' && nextBanner.active
              ? state.banners.map((b) =>
                  b.placement === 'before-about' ? { ...b, active: false } : b
                )
              : state.banners;

          return { banners: [...nextBanners, nextBanner].sort(bannerSort) };
        });
        return id;
      },
      updateBanner: async (id, updates) => {
        await bannerService.updateBanner(id, updates as any);
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
        });
      },
      deleteBanner: async (id) => {
        await bannerService.deleteBanner(id);
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        }));
      },
      reorderBanners: async (placement, bannerIds) => {
        // Optimistic update locally
        set((state) => {
          const untouched = state.banners.filter((b) => b.placement !== placement);
          const reordered = bannerIds
            .map((id) => state.banners.find((b) => b.id === id && b.placement === placement))
            .filter(Boolean)
            .map((b, index) => ({ ...(b as Banner), order: index }));

          return {
            banners: [...untouched, ...reordered].sort(bannerSort),
          };
        });

        // Sync items with new orders to Firebase
        const bannerUpdates = bannerIds.map((id, index) => 
          bannerService.updateBanner(id, { order: index } as any)
        );
        await Promise.all(bannerUpdates);
      },

      // Offers
      offers: defaultOffers,
      addOffer: async (offer) => {
        const id = await offerService.createOffer(offer as any);
        const newOffer = { ...offer, id } as Offer;
        set((state) => ({ offers: [...state.offers, newOffer] }));
        return id;
      },
      updateOffer: async (id, updates) => {
        await offerService.updateOffer(id, updates as any);
        set((state) => ({
          offers: state.offers.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }));
      },
      deleteOffer: async (id) => {
        await offerService.deleteOffer(id);
        set((state) => ({
          offers: state.offers.filter((o) => o.id !== id),
        }));
      },

       // Site config
       siteName: "श्री श्याम Mobiles",
       setSiteName: (name) => set({ siteName: name }),

       // Brands
       brands: defaultBrands,
       addBrand: async (brand) => {
         const id = await brandService.createBrand(brand as any);
         const newBrand = { 
           ...brand, 
           id, 
           createdAt: new Date().toISOString(), 
           updatedAt: new Date().toISOString() 
         } as Brand;
         set((state) => ({ brands: [...state.brands, newBrand] }));
         return id;
       },
       updateBrand: async (id, updates) => {
         await brandService.updateBrand(id, updates as any);
         set((state) => ({
           brands: state.brands.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b)),
         }));
       },
       deleteBrand: async (id) => {
         await brandService.deleteBrand(id);
         set((state) => ({
           brands: state.brands.filter((b) => b.id !== id),
         }));
       },
       getBrand: (id) => get().brands.find((b) => b.id === id),

       // Firebase Sync
       isLoading: false,
       initialize: async () => {
         // Prevent multiple simultaneous initializations
         if (get().isLoading) return;
         
         set({ isLoading: true });
         try {
           const [products, brands, banners, offers, orders] = await Promise.all([
             productService.getProducts().catch(err => { console.error('Products fetch failed:', err); return []; }),
             brandService.getBrands().catch(err => { console.error('Brands fetch failed:', err); return []; }),
             bannerService.getBanners().catch(err => { console.error('Banners fetch failed:', err); return []; }),
             offerService.getOffers().catch(err => { console.error('Offers fetch failed:', err); return []; }),
             orderService.getOrders().catch(err => { console.error('Orders fetch failed:', err); return []; }),
           ]);
           
           set({ 
             products: products || [], 
             brands: brands || [], 
             banners: banners || [], 
             offers: offers || [], 
             orders: orders || [],
             isLoading: false 
           });
         } catch (error) {
           console.error('Failed to initialize admin store:', error);
           set({ isLoading: false });
         }
       },

       // Orders
       orders: [],
       addOrder: async (orderData) => {
         const id = await orderService.createOrder(orderData as any);
         const now = new Date().toISOString();
         const order: Order = {
           ...orderData,
           id,
           orderNumber: orderData.orderNumber || `ORD-${id.slice(-6).toUpperCase()}`,
           createdAt: now,
           updatedAt: now,
         };
         set((state) => ({ orders: [order, ...state.orders] }));
         return id;
       },
       updateOrderStatus: async (orderId, status) => {
         await orderService.updateOrderStatus(orderId, status);
         set((state) => ({
           orders: state.orders.map((o) =>
             o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
           ),
         }));
       },
       deleteOrder: async (orderId) => {
         await orderService.deleteOrder(orderId);
         set((state) => ({
           orders: state.orders.filter((o) => o.id !== orderId),
         }));
       },
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

