import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "./data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deduplicateProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter(p => {
    // Normalization logic same as my python script
    const brand = (p.brand || '').toUpperCase();
    const ram = (p.ram || '').toUpperCase().replace(/\s/g, '');
    const storage = (p.storage || '').toUpperCase().replace(/\s/g, '');
    
    // Fuzzy model name extraction
    let model = (p.name || '').toUpperCase();
    
    // Remove RAM/Storage/Brand from name for fuzzy matching
    const toRemove = [brand, ram, storage, '5G', '4G', 'RAM', 'ROM', '(', ')', '+', ','];
    toRemove.forEach(str => {
      if (str) model = model.split(str).join('');
    });
    
    const cleanModel = model.replace(/[^A-Z0-9]/g, '').trim();
    
    const key = `${brand}|${cleanModel}|${ram}|${storage}`;
    
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
