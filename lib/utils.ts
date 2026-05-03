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
    const toRemove = [brand, '5G', '4G', 'RAM', 'ROM', '(', ')', '+', ',', 'GB'];
    toRemove.forEach(str => {
      if (str) model = model.split(str).join('');
    });

    model = model.replace(/\d+\s*[+\/]\s*\d+/g, ' ');
    model = model.replace(/\d+\s*GB/gi, ' ');
    model = model.replace(/\(.*?\)/g, ' ');
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
