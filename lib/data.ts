export interface ProductVariant {
  id: string;
  ram: string;
  storage: string;
  price: number;
  originalPrice?: number;
  color?: string;
  inStock?: boolean;
}

export interface FirestoreTimestamp {
  type: string;
  seconds: number;
  nanoseconds: number;
}

export interface Product {
  category?: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  ram: string;
  storage: string;
  processor: string;
  battery: string;
  camera: string;
  display: string;
  color?: string;
  colors?: string[];
  featured?: boolean;
  active?: boolean;
  images?: string[];
  description: string;
  variants?: ProductVariant[];
  createdAt?: string | FirestoreTimestamp;
  updatedAt?: string | FirestoreTimestamp;
}

export const brands = [
  'Samsung', 'Apple', 'Vivo', 'Oppo', 'Realme', 'OnePlus', 'Xiaomi', 'Motorola', 'iQOO', 'Poco', 'Nothing', 'Google',
  'Nokia', 'Infinix', 'Lava', 'Tecno', 'Micromax', 'Itel', 'Honor', 'Sony', 'Asus'
];

export const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];
export const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];

import { expandedProducts } from './expanded-catalog';
export const products: Product[] = expandedProducts;
