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
  {
    id: 'apple-20w-power-adapter-wight',
    name: 'APPLE 20W POWER ADAPTER (WIGHT)',
    brand: 'APPLE',
    category: 'power-adapters',
    color: 'WIGHT',
    qty: 1,
    price: 1200,
    unitPrice: 1200,
    image: 'https://placehold.co/600x400?text=APPLE+20W+POWER+ADAPTER+(WIGHT)',
    description: 'APPLE 20W POWER ADAPTER (WIGHT) with premium quality and performance.',
  },
  {
    id: 'fastrack-fastrack-vox-neo-black',
    name: 'FASTRACK FASTRACK VOX NEO (BLACK)',
    brand: 'FASTRACK',
    category: 'earbuds',
    color: 'BLACK',
    qty: 1,
    price: 2080.01,
    unitPrice: 2080.01,
    image: 'https://placehold.co/600x400?text=FASTRACK+FASTRACK+VOX+NEO+(BLACK)',
    description: 'FASTRACK FASTRACK VOX NEO (BLACK) with premium quality and performance.',
  },
  {
    id: 'realme-buds-t200x-forest-blue',
    name: 'REALME BUDS T200X (FOREST BLUE)',
    brand: 'REALME',
    category: 'earbuds',
    color: 'FOREST BLUE',
    qty: 1,
    price: 1150,
    unitPrice: 1150,
    image: 'https://placehold.co/600x400?text=REALME+BUDS+T200X+(FOREST+BLUE)',
    description: 'REALME BUDS T200X (FOREST BLUE) with premium quality and performance.',
  },
  {
    id: 'realme-buds-t200x-pure-black',
    name: 'REALME BUDS T200X (PURE BLACK)',
    brand: 'REALME',
    category: 'earbuds',
    color: 'PURE BLACK',
    qty: 1,
    price: 1150,
    unitPrice: 1150,
    image: 'https://placehold.co/600x400?text=REALME+BUDS+T200X+(PURE+BLACK)',
    description: 'REALME BUDS T200X (PURE BLACK) with premium quality and performance.',
  },
  {
    id: 'realme-buds-wireless-5-lite-void-black',
    name: 'REALME BUDS WIRELESS 5 LITE (VOID BLACK)',
    brand: 'REALME',
    category: 'earbuds',
    color: 'VOID BLACK',
    qty: 1,
    price: 900,
    unitPrice: 900,
    image: 'https://placehold.co/600x400?text=REALME+BUDS+WIRELESS+5+LITE+(VOID+BLACK)',
    description: 'REALME BUDS WIRELESS 5 LITE (VOID BLACK) with premium quality and performance.',
  },
  {
    id: 'realme-realme-duds-wireless-3-neo-blue',
    name: 'REALME REALME DUDS WIRELESS 3 NEO (BLUE)',
    brand: 'REALME',
    category: 'earbuds',
    color: 'BLUE',
    qty: 1,
    price: 1000,
    unitPrice: 1000,
    image: 'https://placehold.co/600x400?text=REALME+REALME+DUDS+WIRELESS+3+NEO+(BLUE)',
    description: 'REALME REALME DUDS WIRELESS 3 NEO (BLUE) with premium quality and performance.',
  },
  {
    id: 'realme-realme-duds-wireless-3-neo-green',
    name: 'REALME REALME DUDS WIRELESS 3 NEO (GREEN)',
    brand: 'REALME',
    category: 'earbuds',
    color: 'GREEN',
    qty: 1,
    price: 1100.01,
    unitPrice: 1100.01,
    image: 'https://placehold.co/600x400?text=REALME+REALME+DUDS+WIRELESS+3+NEO+(GREEN)',
    description: 'REALME REALME DUDS WIRELESS 3 NEO (GREEN) with premium quality and performance.',
  },
  {
    id: 'samsung-samsung-25w-power-adapter-black',
    name: 'SAMSUNG SAMSUNG 25W POWER ADAPTER (BLACK)',
    brand: 'SAMSUNG',
    category: 'power-adapters',
    color: 'BLACK',
    qty: 1,
    price: 700,
    unitPrice: 700,
    image: 'https://placehold.co/600x400?text=SAMSUNG+SAMSUNG+25W+POWER+ADAPTER+(BLACK)',
    description: 'SAMSUNG SAMSUNG 25W POWER ADAPTER (BLACK) with premium quality and performance.',
  },
  {
    id: 'samsung-samsung-45w-power-adapter-black',
    name: 'SAMSUNG SAMSUNG 45W POWER ADAPTER (BLACK)',
    brand: 'SAMSUNG',
    category: 'power-adapters',
    color: 'BLACK',
    qty: 1,
    price: 1500,
    unitPrice: 1500,
    image: 'https://placehold.co/600x400?text=SAMSUNG+SAMSUNG+45W+POWER+ADAPTER+(BLACK)',
    description: 'SAMSUNG SAMSUNG 45W POWER ADAPTER (BLACK) with premium quality and performance.',
  },
];



// Summary data
export const inventorySummary = {
  categories: [
    { name: 'Power Adapters', items: 3, quantity: 3, amount: 702 },
    { name: 'Earbuds/Neckbands', items: 5, quantity: 5, amount: 923 },
    { name: 'Smartwatch', items: 1, quantity: 1, amount: 2 },
    { name: 'Tablet', items: 1, quantity: 1, amount: 26 },
  ],
  grandTotal: { items: 10, quantity: 10, amount: 1653 },
};
