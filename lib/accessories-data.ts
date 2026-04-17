export interface Accessory {
  id: string;
  name: string;
  brand: string;
  category: 'power-adapters' | 'earbuds' | 'smartwatch' | 'tablet';
  color: string;
  qty: number;
  price: number;
  unitPrice: number;
  image: string;
  description: string;
}

export const accessoryCategories = [
  { id: 'power-adapters', name: 'Power Adapters', icon: '🔌', emoji: '🔌' },
  { id: 'earbuds', name: 'Earbuds & Neckbands', icon: '🎧', emoji: '🎧' },
  { id: 'smartwatch', name: 'Smartwatches', icon: '⌚', emoji: '⌚' },
  { id: 'tablet', name: 'Tablets', icon: '📱', emoji: '📱' },
] as const;

export const accessories: Accessory[] = [
  // === POWER ADAPTERS ===
  {
    id: 'apple-20w-adapter',
    name: 'Apple 20W Power Adapter',
    brand: 'Apple',
    category: 'power-adapters',
    color: 'White',
    qty: 28,
    price: 33840,
    unitPrice: 1209,
    image: 'https://m.media-amazon.com/images/I/51YFn7KCjpL._SX679_.jpg',
    description: 'Apple 20W USB-C Power Adapter for fast charging your iPhone and iPad. Compact, efficient, and reliable.',
  },
  {
    id: 'samsung-25w-adapter',
    name: 'Samsung 25W Power Adapter',
    brand: 'Samsung',
    category: 'power-adapters',
    color: 'Black',
    qty: 18,
    price: 12600,
    unitPrice: 700,
    image: 'https://m.media-amazon.com/images/I/31Zp5hMKfRL._SX679_.jpg',
    description: 'Samsung 25W USB-C Super Fast Charging Wall Charger. Compatible with Galaxy smartphones and tablets.',
  },
  {
    id: 'samsung-45w-adapter',
    name: 'Samsung 45W Power Adapter',
    brand: 'Samsung',
    category: 'power-adapters',
    color: 'Black',
    qty: 9,
    price: 13500,
    unitPrice: 1500,
    image: 'https://m.media-amazon.com/images/I/41gKdru5YML._SX679_.jpg',
    description: 'Samsung 45W USB-C Super Fast Charging 2.0 Wall Charger. Ultra-fast charging for Galaxy flagship devices.',
  },

  // === EARBUDS & NECKBANDS ===
  {
    id: 'fastrack-vox-neo-earbuds',
    name: 'Fastrack Vox Neo Earbuds',
    brand: 'Fastrack',
    category: 'earbuds',
    color: 'Black',
    qty: 1,
    price: 2080,
    unitPrice: 2080,
    image: 'https://m.media-amazon.com/images/I/51qKeBqh6bL._SX679_.jpg',
    description: 'Fastrack Vox Neo wireless earbuds with deep bass, long battery life, and comfortable fit for all-day listening.',
  },
  {
    id: 'realme-buds-t200x-forest-blue',
    name: 'Realme Buds T200X',
    brand: 'Realme',
    category: 'earbuds',
    color: 'Forest Blue',
    qty: 1,
    price: 1150,
    unitPrice: 1150,
    image: 'https://m.media-amazon.com/images/I/51U2FKKNSVL._SX679_.jpg',
    description: 'Realme Buds T200X true wireless earbuds with AI ENC for calls, up to 40 hours playback, and IPX5 water resistance.',
  },
  {
    id: 'realme-buds-t200x-pure-black',
    name: 'Realme Buds T200X',
    brand: 'Realme',
    category: 'earbuds',
    color: 'Pure Black',
    qty: 1,
    price: 1150,
    unitPrice: 1150,
    image: 'https://m.media-amazon.com/images/I/51U2FKKNSVL._SX679_.jpg',
    description: 'Realme Buds T200X true wireless earbuds with AI ENC for calls, up to 40 hours playback, and IPX5 water resistance.',
  },
  {
    id: 'realme-buds-wireless-5-lite',
    name: 'Realme Buds Wireless 5 Lite',
    brand: 'Realme',
    category: 'earbuds',
    color: 'Void Black',
    qty: 1,
    price: 900,
    unitPrice: 900,
    image: 'https://m.media-amazon.com/images/I/51Y8JrdgRaL._SX679_.jpg',
    description: 'Realme Buds Wireless 5 Lite neckband with 13.4mm Dynamic Bass Driver, up to 30 hours playback, and fast charging.',
  },
  {
    id: 'realme-buds-wireless-3-neo-blue',
    name: 'Realme Buds Wireless 3 Neo',
    brand: 'Realme',
    category: 'earbuds',
    color: 'Blue',
    qty: 1,
    price: 1000,
    unitPrice: 1000,
    image: 'https://m.media-amazon.com/images/I/51dQijzgIkL._SX679_.jpg',
    description: 'Realme Buds Wireless 3 Neo neckband with 13.6mm driver, 32 hours playback, and Bluetooth 5.4 connectivity.',
  },
  {
    id: 'realme-buds-wireless-3-neo-green',
    name: 'Realme Buds Wireless 3 Neo',
    brand: 'Realme',
    category: 'earbuds',
    color: 'Green',
    qty: 1,
    price: 1100,
    unitPrice: 1100,
    image: 'https://m.media-amazon.com/images/I/51dQijzgIkL._SX679_.jpg',
    description: 'Realme Buds Wireless 3 Neo neckband with 13.6mm driver, 32 hours playback, and Bluetooth 5.4 connectivity.',
  },

  // === SMARTWATCH ===
  {
    id: 'fastrack-vox-neo-watch',
    name: 'Fastrack Vox Neo Smartwatch',
    brand: 'Fastrack',
    category: 'smartwatch',
    color: 'Black',
    qty: 1,
    price: 2080,
    unitPrice: 2080,
    image: 'https://m.media-amazon.com/images/I/61bkVkGhuwL._SX679_.jpg',
    description: 'Fastrack Vox Neo smartwatch with round AMOLED display, heart rate monitoring, SpO2, and 7-day battery life.',
  },
  {
    id: 'fastrack-vox-pro-watch',
    name: 'Fastrack Vox Pro Smartwatch',
    brand: 'Fastrack',
    category: 'smartwatch',
    color: 'Gun Metal',
    qty: 1,
    price: 2080,
    unitPrice: 2080,
    image: 'https://m.media-amazon.com/images/I/61HjwU3mvAL._SX679_.jpg',
    description: 'Fastrack Vox Pro smartwatch with premium metallic build, BT calling, 100+ watch faces, and advanced fitness tracking.',
  },

  // === TABLET ===
  {
    id: 'samsung-tab-a11-plus-5g',
    name: 'Samsung Galaxy Tab A11+ 5G',
    brand: 'Samsung',
    category: 'tablet',
    color: 'Gray',
    qty: 1,
    price: 26189,
    unitPrice: 26189,
    image: 'https://m.media-amazon.com/images/I/71H31M2simL._SX679_.jpg',
    description: 'Samsung Galaxy Tab A11+ 5G with 6GB RAM, 128GB storage, 11-inch display, and 5G connectivity for work and entertainment.',
  },
];

// Summary data
export const inventorySummary = {
  categories: [
    { name: 'Power Adapters', items: 3, quantity: 55, amount: 59940 },
    { name: 'Earbuds/Neckbands', items: 6, quantity: 6, amount: 7380 },
    { name: 'Smartwatch', items: 2, quantity: 2, amount: 4160 },
    { name: 'Tablet', items: 1, quantity: 1, amount: 26189 },
  ],
  grandTotal: { items: 12, quantity: 64, amount: 97669 },
};
