// lib/image-utils.ts
// Cloudinary URL transformation utilities for optimized image delivery.
// Automatically converts images to WebP/AVIF, applies quality compression,
// and generates responsive srcsets.

/**
 * Check if a URL is a Cloudinary URL
 */
function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

/**
 * Transform a Cloudinary URL to use auto-format (WebP/AVIF) and quality optimization.
 * For non-Cloudinary URLs, returns the original URL (Next.js Image handles optimization).
 * 
 * @param url - Original image URL
 * @param options - Transformation options
 * @returns Optimized URL
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'avif';
    crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  } = {}
): string {
  if (!url || !isCloudinaryUrl(url)) return url;

  const { width, height, quality = 'auto', format = 'auto', crop = 'limit' } = options;

  // Build transformation string
  const transforms: string[] = [];
  transforms.push(`f_${format}`);
  transforms.push(`q_${quality}`);

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');

  // Insert transformation after /upload/ in Cloudinary URL
  return url.replace(
    '/upload/',
    `/upload/${transformString}/`
  );
}

/**
 * Generate responsive Cloudinary srcset for Next.js Image component.
 * Returns a blurDataURL for the placeholder.
 */
export function getCloudinaryBlurUrl(url: string): string {
  if (!url || !isCloudinaryUrl(url)) return '';
  return url.replace('/upload/', '/upload/w_20,q_10,f_webp,e_blur:200/');
}

/**
 * Format a product image URL for optimal delivery.
 * Applies auto-format and auto-quality.
 */
export function getProductImageUrl(url: string, size: 'thumbnail' | 'card' | 'detail' | 'full' = 'card'): string {
  const sizeMap = {
    thumbnail: { width: 100, quality: 'auto:eco' as const },
    card: { width: 400, quality: 'auto:good' as const },
    detail: { width: 800, quality: 'auto:best' as const },
    full: { quality: 'auto:best' as const },
  };

  return optimizeImageUrl(url, sizeMap[size]);
}
