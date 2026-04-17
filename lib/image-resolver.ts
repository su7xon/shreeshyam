
const brandImages: Record<string, string> = {
  'Samsung': 'https://m.media-amazon.com/images/I/71RVuS3q9QL._SX679_.jpg',
  'Apple': 'https://m.media-amazon.com/images/I/81+GIkwqLIL._SX679_.jpg',
  'Vivo': 'https://m.media-amazon.com/images/I/61SOnZ8FidL._SX679_.jpg',
  'Oppo': 'https://m.media-amazon.com/images/I/71R2H9+tIOL._SX679_.jpg',
  'Realme': 'https://m.media-amazon.com/images/I/71p0WfO8X9L._SX679_.jpg',
  'OnePlus': 'https://m.media-amazon.com/images/I/71S6d6-Gv3L._SX679_.jpg',
  'Xiaomi': 'https://m.media-amazon.com/images/I/61Gg9Y6C03L._SX679_.jpg',
  'Motorola': 'https://m.media-amazon.com/images/I/71z7R+Xv+PL._SX679_.jpg',
  'iQOO': 'https://m.media-amazon.com/images/I/71S-J2fB79L._SX679_.jpg',
  'Poco': 'https://m.media-amazon.com/images/I/51r2XG5XFDL._SX679_.jpg',
  'Nothing': 'https://m.media-amazon.com/images/I/71Y7y31uJdL._SX679_.jpg',
  'Google': 'https://m.media-amazon.com/images/I/81shKcv8FSL._SX679_.jpg',
  'Infinix': 'https://m.media-amazon.com/images/I/61+Rsh-XqxL._SX679_.jpg',
  'Tecno': 'https://m.media-amazon.com/images/I/61id8-fS2fL._SX679_.jpg',
  'Lava': 'https://m.media-amazon.com/images/I/71H7-N0BfAL._SX679_.jpg',
  'Itel': 'https://m.media-amazon.com/images/I/71s8p0yH61L._SX679_.jpg',
  'Nokia': 'https://m.media-amazon.com/images/I/41O2466KqKL.jpg',
  'HMD': 'https://m.media-amazon.com/images/I/41O2466KqKL.jpg',
  'Philips': 'https://m.media-amazon.com/images/I/41O2466KqKL.jpg',
};

export const getProductImage = (name: string, brand: string = ''): string => {
  const brandKey = Object.keys(brandImages).find(k => 
    (brand && brand.toLowerCase().includes(k.toLowerCase())) || 
    name.toLowerCase().includes(k.toLowerCase())
  );
  
  // Specific model mappings for a more "real" feel
  if (name.toLowerCase().includes('ultra')) return 'https://m.media-amazon.com/images/I/71RVuS3q9QL._SL1500_.jpg';
  if (name.toLowerCase().includes('fold')) return 'https://m.media-amazon.com/images/I/71S6d6-Gv3L._SL1500_.jpg'; // Placeholder for fold
  if (name.toLowerCase().includes('pro')) {
    if (brand.toLowerCase() === 'apple') return 'https://m.media-amazon.com/images/I/81+GIkwqLIL._SL1500_.jpg';
    if (brand.toLowerCase() === 'oppo') return 'https://m.media-amazon.com/images/I/71R2H9+tIOL._SL1500_.jpg';
    if (brand.toLowerCase() === 'vivo') return 'https://m.media-amazon.com/images/I/61SOnZ8FidL._SL1500_.jpg';
  }

  return brandImages[brandKey || ''] || 'https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg';
};

// Accessory image resolver
const accessoryImages: Record<string, string> = {
  // Power Adapters
  'apple-20w-adapter':   'https://m.media-amazon.com/images/I/316biYSPx+L._SX300_SY300_QL70_FMwebp_.jpg',
  'samsung-25w-adapter': 'https://m.media-amazon.com/images/I/41HH5SQKPNL._SX300_SY300_QL70_FMwebp_.jpg',
  'samsung-45w-adapter': 'https://m.media-amazon.com/images/I/41mvp5YQSSL._SX300_SY300_QL70_FMwebp_.jpg',
  // Earbuds
  'fastrack-vox-neo-earbuds':       'https://m.media-amazon.com/images/I/61Y8JrdgRaL._SX679_.jpg',
  'realme-buds-t200x-forest-blue':  'https://m.media-amazon.com/images/I/61qHNyaqzUL._SX679_.jpg',
  'realme-buds-t200x-pure-black':   'https://m.media-amazon.com/images/I/61qHNyaqzUL._SX679_.jpg',
  'realme-buds-wireless-5-lite':    'https://m.media-amazon.com/images/I/71Tg5CZJOWL._SX679_.jpg',
  'realme-buds-wireless-3-neo-blue':'https://m.media-amazon.com/images/I/71DGnkLIBuL._SX679_.jpg',
  'realme-buds-wireless-3-neo-green':'https://m.media-amazon.com/images/I/71DGnkLIBuL._SX679_.jpg',
  // Smartwatches
  'fastrack-vox-neo-watch': 'https://m.media-amazon.com/images/I/61bkVkGhuwL._SX679_.jpg',
  'fastrack-vox-pro-watch': 'https://m.media-amazon.com/images/I/61HjwU3mvAL._SX679_.jpg',
  // Tablets
  'samsung-tab-a11-plus-5g': 'https://m.media-amazon.com/images/I/81CZ1qPeT5L._SX679_.jpg',
};

export const getAccessoryImage = (id: string): string => {
  return accessoryImages[id] || 'https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg';
};

