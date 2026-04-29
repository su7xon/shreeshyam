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
  featured?: boolean;
  active?: boolean;
  images?: string[];
  description: string;
}

export const brands = [
  'Samsung', 'Apple', 'Vivo', 'Oppo', 'Realme', 'OnePlus', 'Xiaomi', 'Motorola', 'iQOO', 'Poco', 'Nothing', 'Google'
];

export const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];
export const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];

import { expandedProducts } from './expanded-catalog';
export const products: Product[] = expandedProducts;
