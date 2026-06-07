import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "./data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deduplicateProducts(products: Product[]): Product[] {
  const byModel = new Map<string, Product>();

  for (const p of products) {
    const brand = (p.brand || '').toUpperCase();

    // Normalize model name by stripping specs, colors, and common tokens
    let model = (p.name || '').toUpperCase();
    
    // First remove colors in parentheses like "(PRISM VIOLET, ICY BLUE)"
    model = model.replace(/\(.*?\)/g, ' ');

    // Remove RAM/Storage patterns like "4+128", "8GB/256GB", "8+128GB"
    model = model.replace(/\b\d+\s*[+/]\s*\d+\b/g, ' ');
    
    // Remove "GB", "5G", "4G"
    const toRemove = [brand, '5G', '4G', 'RAM', 'ROM', 'GB'];
    toRemove.forEach(str => {
      if (str) model = model.split(str).join(' ');
    });

    // Remove stray numbers that might be RAM/Storage
    model = model.replace(/\b\d+\b/g, (match) => {
      // If it's a known RAM/Storage size, remove it (e.g. 4, 6, 8, 12, 16, 32, 64, 128, 256, 512, 1024)
      const num = parseInt(match, 10);
      if ([2, 3, 4, 6, 8, 12, 16, 32, 64, 128, 256, 512, 1024].includes(num)) {
        return ' ';
      }
      return match; // keep other numbers (like "14" in iPhone 14)
    });

    const cleanModel = model.replace(/[^A-Z0-9]/g, '').trim();

    const key = `${brand}|${cleanModel}`;
    const existing = byModel.get(key);

    if (!existing) {
      byModel.set(key, p);
      continue;
    }

    const existingPrice = Number(existing.price || 0);
    const currentPrice = Number(p.price || 0);
    if (currentPrice > 0 && (existingPrice === 0 || currentPrice < existingPrice)) {
      byModel.set(key, p);
    }
  }

  return Array.from(byModel.values());
}
