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
  description: string;
}

export const brands = [
  'Samsung', 'Apple', 'Vivo', 'Oppo', 'Realme', 'OnePlus', 'Xiaomi', 'Motorola', 'iQOO', 'Poco', 'Nothing', 'Google'
];

export const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB'];
export const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];

export const products: Product[] = [
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 129999,
    originalPrice: 134999,
    image: 'https://m.media-amazon.com/images/I/71RVuS3q9QL._SX679_.jpg',
    ram: '12GB',
    storage: '256GB',
    processor: 'Snapdragon 8 Gen 3',
    battery: '5000mAh',
    camera: '200MP + 50MP + 12MP + 10MP',
    display: '6.8" Dynamic AMOLED 2X',
    featured: true,
    description: 'The ultimate Galaxy Ultra experience with Galaxy AI, featuring a titanium frame and the most advanced camera system yet.'
  },
  {
    id: 'iphone-15-pro',
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    price: 134900,
    originalPrice: 139900,
    image: 'https://m.media-amazon.com/images/I/81+GIkwqLIL._SL1500_.jpg',
    ram: '8GB',
    storage: '128GB',
    processor: 'A17 Pro chip',
    battery: '3274mAh',
    camera: '48MP + 12MP + 12MP',
    display: '6.1" Super Retina XDR OLED',
    featured: true,
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.'
  },
  {
    id: 'vivo-v30-pro',
    name: 'Vivo V30 Pro 5G',
    brand: 'Vivo',
    price: 41999,
    originalPrice: 46999,
    image: 'https://m.media-amazon.com/images/I/61SOnZ8FidL._SX679_.jpg',
    ram: '12GB',
    storage: '256GB',
    processor: 'Dimensity 8200',
    battery: '5000mAh',
    camera: '50MP + 50MP + 50MP',
    display: '6.78" AMOLED 120Hz',
    featured: true,
    description: 'Experience professional-grade portraits with the ZEISS Co-engineered camera system and breathtaking slim design.'
  },
  {
    id: 'oppo-reno-12-pro',
    name: 'OPPO Reno 12 Pro 5G',
    brand: 'Oppo',
    price: 36999,
    originalPrice: 40999,
    image: 'https://m.media-amazon.com/images/I/71R2H9+tIOL._SX679_.jpg',
    ram: '12GB',
    storage: '256GB',
    processor: 'Dimensity 7300-Energy',
    battery: '5000mAh',
    camera: '50MP + 50MP + 8MP',
    display: '6.7" AMOLED Quad-Curved',
    featured: true,
    description: 'The AI Phone for everyone, featuring advanced AI photography, a stunning quad-curved display, and robust durability.'
  },
  {
    id: 'realme-12-pro-plus',
    name: 'Realme 12 Pro+ 5G',
    brand: 'Realme',
    price: 29999,
    originalPrice: 34999,
    image: 'https://m.media-amazon.com/images/I/71p0WfO8X9L._SL1500_.jpg',
    ram: '12GB',
    storage: '256GB',
    processor: 'Snapdragon 7s Gen 2',
    battery: '5000mAh',
    camera: '64MP Periscope + 50MP + 8MP',
    display: '6.7" OLED Curve',
    featured: true,
    description: 'Master the zoom with the 64MP Periscope Portrait Camera and premium luxury watch-inspired design.'
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    price: 64999,
    originalPrice: 69999,
    image: 'https://m.media-amazon.com/images/I/71S6d6-Gv3L._SL1500_.jpg',
    ram: '12GB',
    storage: '256GB',
    processor: 'Snapdragon 8 Gen 3',
    battery: '5400mAh',
    camera: '50MP + 64MP + 48MP',
    display: '6.82" 2K ProXDR 120Hz',
    featured: true,
    description: 'Smooth Beyond Belief. Flagship performance with 4th Gen Hasselblad Camera for Mobile and ultra-fast charging.'
  },
  {
    id: 'nothing-phone-2',
    name: 'Nothing Phone (2)',
    brand: 'Nothing',
    price: 39999,
    originalPrice: 44999,
    image: 'https://m.media-amazon.com/images/I/71Y7y31uJdL._SL1500_.jpg',
    ram: '12GB',
    storage: '256GB',
    processor: 'Snapdragon 8+ Gen 1',
    battery: '4700mAh',
    camera: '50MP + 50MP',
    display: '6.7" LTPO OLED',
    featured: true,
    description: 'The iconic Glyph Interface meets premium performance and a uniquely refined OS experience.'
  },
  {
    id: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: 106999,
    originalPrice: 109999,
    image: 'https://m.media-amazon.com/images/I/81shKcv8FSL._SL1500_.jpg',
    ram: '12GB',
    storage: '128GB',
    processor: 'Google Tensor G3',
    battery: '5050mAh',
    camera: '50MP + 48MP + 48MP',
    display: '6.7" Super Actua Display',
    featured: true,
    description: 'The all-pro phone engineered by Google, with the most advanced Pixel Camera and Google AI for better photos and videos.'
  },
  {
    id: 'motorola-edge-50-pro',
    name: 'Motorola Edge 50 Pro',
    brand: 'Motorola',
    price: 31999,
    originalPrice: 35999,
    image: 'https://m.media-amazon.com/images/I/71z7R+Xv+PL._SL1500_.jpg',
    ram: '12GB',
    storage: '256GB',
    processor: 'Snapdragon 7 Gen 3',
    battery: '4500mAh',
    camera: '50MP AI + 13MP + 10MP',
    display: '6.7" 1.5K pOLED Curved',
    featured: true,
    description: 'World\'s first AI-powered pro-grade camera and Pantone-validated display in a stunningly curved design.'
  },
  {
    id: 'xiaomi-14',
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    price: 69999,
    originalPrice: 79999,
    image: 'https://m.media-amazon.com/images/I/716uY9kE3aL._SL1500_.jpg',
    ram: '12GB',
    storage: '512GB',
    processor: 'Snapdragon 8 Gen 3',
    battery: '4610mAh',
    camera: '50MP Leica + 50MP + 50MP',
    display: '6.36" LTPO AMOLED',
    featured: true,
    description: 'Compact size, massive performance. Leica Summilux optical lens and Light Fusion 900 image sensor for legendary photography.'
  }
];

