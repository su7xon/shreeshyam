import { getProductImage } from './lib/image-resolver';

export interface ProductData {
  name: string;
  brand: string;
  price: number;
  ram: string;
  storage: string;
  image: string;
}

export const productsData: ProductData[] = [
  { name: "HMD 105 4G TA-1657 DS (CYAN)", brand: "HMD", price: 1899, ram: "8GB", storage: "128GB", image: getProductImage("HMD 105 4G TA-1657 DS") },
  { name: "HMD HMD 100 SINGLE SIM (GREY)", brand: "HMD", price: 810, ram: "8GB", storage: "128GB", image: getProductImage("HMD HMD 100 SINGLE SIM") },
  { name: "HMD HMD 101 DUAL SIM (BLUE)", brand: "HMD", price: 889, ram: "8GB", storage: "128GB", image: getProductImage("HMD HMD 101 DUAL SIM") },
  { name: "HMD HMD 1014G TA-1727DS (BLUE)", brand: "HMD", price: 1699, ram: "8GB", storage: "128GB", image: getProductImage("HMD HMD 1014G TA-1727DS") },
  { name: "HMD HMD 102 4G DUAL SIM (PURPLE)", brand: "HMD", price: 1909, ram: "8GB", storage: "128GB", image: getProductImage("HMD HMD 102 4G DUAL SIM") },
  { name: "HMD HMD 102 DUAL SIM (BLUE)", brand: "HMD", price: 1099, ram: "8GB", storage: "128GB", image: getProductImage("HMD HMD 102 DUAL SIM") },
  { name: "INFINIX HOT 60I 5G 4GB+128 (OPPO A6 5G)", brand: "INFINIX", price: 10199, ram: "4GB", storage: "128GB", image: getProductImage("INFINIX HOT 60I 5G") },
  { name: "INFINIX HOT 60I 5G 6GB+128 (OPPO A6 5G)", brand: "INFINIX", price: 11199, ram: "6GB", storage: "128GB", image: getProductImage("INFINIX HOT 60I 5G") },
  { name: "INFINIX INFINIX GT30 8GB+128GB 5G (PULSE GREEN)", brand: "INFINIX", price: 18100, ram: "8GB", storage: "128GB", image: getProductImage("INFINIX INFINIX GT30") },
  { name: "ITEL ACE3 SHINE (DEEP BLUE)", brand: "ITEL", price: 770, ram: "8GB", storage: "128GB", image: getProductImage("ITEL ACE3 SHINE") },
  { name: "ITEL IT2165C (BLACK)", brand: "ITEL", price: 869, ram: "8GB", storage: "128GB", image: getProductImage("ITEL IT2165C") },
  { name: "ITEL IT2181A (DEEP BLUE)", brand: "ITEL", price: 924, ram: "8GB", storage: "128GB", image: getProductImage("ITEL IT2181A") },
  { name: "ITEL IT5032 (IT5027SLIM) (BLACK)", brand: "ITEL", price: 1139, ram: "8GB", storage: "128GB", image: getProductImage("ITEL IT5032") },
  { name: "ITEL IT5262 (BLACK)", brand: "ITEL", price: 1299, ram: "8GB", storage: "128GB", image: getProductImage("ITEL IT5262") },
  { name: "ITEL IT9020 SUPERGURU 4G (BLUE)", brand: "ITEL", price: 1630, ram: "8GB", storage: "128GB", image: getProductImage("ITEL IT9020 SUPERGURU 4G") },
  { name: "LAVA LAVA HEROSHAKTI 2025 (BLUE)", brand: "LAVA", price: 710, ram: "8GB", storage: "128GB", image: getProductImage("LAVA LAVA HEROSHAKTI 2025") },
  { name: "MOTOROLA CD1802 MOTOA200 (BLACK)", brand: "MOTOROLA", price: 888, ram: "8GB", storage: "128GB", image: getProductImage("MOTOROLA CD1802 MOTOA200") },
  { name: "NOKIA 1104G NEW TA-1664 (BLUE)", brand: "NOKIA", price: 2099, ram: "8GB", storage: "128GB", image: getProductImage("NOKIA 1104G NEW TA-1664") },
  { name: "NOKIA HMD 105DS 4G TA-1633 (BLACK)", brand: "NOKIA", price: 929, ram: "8GB", storage: "128GB", image: getProductImage("NOKIA HMD 105DS 4G TA-1633") },
  { name: "NOKIA HMD 105DS 4G TA-1657 (CYAN)", brand: "NOKIA", price: 1899, ram: "8GB", storage: "128GB", image: getProductImage("NOKIA HMD 105DS 4G TA-1657") },
  { name: "NOKIA NOKIA 105 TA-1575 SS (CHARCOAL)", brand: "NOKIA", price: 1139, ram: "8GB", storage: "128GB", image: getProductImage("NOKIA NOKIA 105 TA-1575 SS") },
  { name: "NOKIA NOKIA HMD 100 SINGAL SIM (GREY)", brand: "NOKIA", price: 810, ram: "8GB", storage: "128GB", image: getProductImage("NOKIA NOKIA HMD 100 SINGAL SIM") },
  { name: "OPPO CPH2705 F29PRO 5G 12GB+256GB (MARBLE WHITE)", brand: "OPPO", price: 26500, ram: "12GB", storage: "256GB", image: getProductImage("OPPO CPH2705 F29PRO 5G") },
  { name: "OPPO DEMO A6 PRO 8GB+128GB (AURORA GOLD)", brand: "OPPO", price: 13499, ram: "8GB", storage: "128GB", image: getProductImage("OPPO DEMO A6 PRO") },
  { name: "OPPO DEMO OPPO RENO 15 12GB+256GB (GLACIER WHITE)", brand: "OPPO", price: 29499, ram: "12GB", storage: "256GB", image: getProductImage("OPPO DEMO OPPO RENO 15") },
  { name: "OPPO F31 PRO PLUSE 12G256 (GEMSTONE BLUE)", brand: "OPPO", price: 33200, ram: "8GB", storage: "128GB", image: getProductImage("OPPO F31 PRO PLUSE 12G256") },
  { name: "OPPO F31PRO5G 8+256 (DESERT GOLD)", brand: "OPPO", price: 28499, ram: "8GB", storage: "256GB", image: getProductImage("OPPO F31PRO5G") },
  { name: "OPPO K13TURBO PRO 5G 8GB+256 (SILVER KNIGHT)", brand: "OPPO", price: 36300, ram: "8GB", storage: "128GB", image: getProductImage("OPPO K13TURBO PRO 5G") },
  { name: "OPPO OPPO F31 5G8+256 (CLOUD GREEN)", brand: "OPPO", price: 27300, ram: "8GB", storage: "256GB", image: getProductImage("OPPO OPPO F31 5G") },
  { name: "OPPO OPPO F31 PRO5G 12GB+256 (DESERT GOLD)", brand: "OPPO", price: 29499, ram: "12GB", storage: "128GB", image: getProductImage("OPPO OPPO F31 PRO5G") },
  { name: "REALME REALME 15 PRO 8+128 (PURPLE)", brand: "REALME", price: 21999, ram: "8GB", storage: "128GB", image: getProductImage("REALME REALME 15 PRO") },
  { name: "REALME REALME 16 PRO 5G 8+256 (SKYLINE BLUE)", brand: "REALME", price: 32300, ram: "8GB", storage: "256GB", image: getProductImage("REALME REALME 16 PRO 5G") },
  { name: "REALME REALME C61 4+64 (SAFRAN YELLOW)", brand: "REALME", price: 7499, ram: "4GB", storage: "64GB", image: getProductImage("REALME REALME C61") },
  { name: "REALME REALME P3X 5G 8+128 (TITANIUM GREY)", brand: "REALME", price: 13499, ram: "8GB", storage: "128GB", image: getProductImage("REALME REALME P3X 5G") },
  { name: "SAMSUNG GALAXY S25 FE 8GB+512GB (BLACK)", brand: "SAMSUNG", price: 69999, ram: "8GB", storage: "512GB", image: getProductImage("SAMSUNG GALAXY S25 FE") },
  { name: "SAMSUNG SM-A076B/DS GALAXY A07 5G (BLACK)", brand: "SAMSUNG", price: 14200, ram: "8GB", storage: "128GB", image: getProductImage("SAMSUNG SM-A076B/DS GALAXY A07 5G") },
  { name: "SAMSUNG SM-A176B/DS GALAXY A17 5G (BLACK)", brand: "SAMSUNG", price: 19100, ram: "8GB", storage: "128GB", image: getProductImage("SAMSUNG SM-A176B/DS GALAXY A17 5G") },
  { name: "SAMSUNG SM-A176B/DS GALAXY A17 5G (LIGHT BLUE)", brand: "SAMSUNG", price: 19100, ram: "8GB", storage: "128GB", image: getProductImage("SAMSUNG SM-A176B/DS GALAXY A17 5G") },
  { name: "SAMSUNG SM-A176B/DS GALAXY A17 5G (LIGHT GREEN)", brand: "SAMSUNG", price: 19100, ram: "8GB", storage: "128GB", image: getProductImage("SAMSUNG SM-A176B/DS GALAXY A17 5G") },
  { name: "SAMSUNG SM-A176B/DS GALAXY A17 5G 8GB+256GB (BLACK)", brand: "SAMSUNG", price: 28999, ram: "8GB", storage: "256GB", image: getProductImage("SAMSUNG SM-A176B/DS GALAXY A17 5G") },
  { name: "SAMSUNG SM-A356B GALAXY A35 5G 8GB+256GB (AWESOME ICE BLUE)", brand: "SAMSUNG", price: 32999, ram: "8GB", storage: "256GB", image: getProductImage("SAMSUNG SM-A356B GALAXY A35 5G") },
  { name: "SAMSUNG SM-A366B GALAXY A36 5G 8GB+128GB (AWESOME NAVY)", brand: "SAMSUNG", price: 27999, ram: "8GB", storage: "128GB", image: getProductImage("SAMSUNG SM-A366B GALAXY A36 5G") },
  { name: "SAMSUNG SM-A566B GALAXY A56 5G 12GB+256GB (AWESOME ICEBLUE)", brand: "SAMSUNG", price: 44999, ram: "12GB", storage: "256GB", image: getProductImage("SAMSUNG SM-A566B GALAXY A56 5G") },
  { name: "SAMSUNG SM-F566B GALAXY F56 5G 8GB+256GB (BLACK)", brand: "SAMSUNG", price: 29999, ram: "8GB", storage: "256GB", image: getProductImage("SAMSUNG SM-F566B GALAXY F56 5G") },
  { name: "SAMSUNG SAMSUNG GALAXY TAB A11+ 5G 6+128 (GRAY)", brand: "SAMSUNG", price: 26100, ram: "6GB", storage: "128GB", image: getProductImage("Galaxy Tab A11+") },
  { name: "VIVO V2431 V40 LITE 8GB+128GB (TITANIUM SILVER)", brand: "VIVO", price: 20100, ram: "8GB", storage: "128GB", image: getProductImage("VIVO V2431 V40 LITE") },
  { name: "VIVO V2431 V40 LITE 8GB+256GB (DYNAMIC BLACK)", brand: "VIVO", price: 21900, ram: "8GB", storage: "256GB", image: getProductImage("VIVO V2431 V40 LITE") },
  { name: "VIVO V2431 V40 LITE 8GB+256GB (TITANIUM SILVER)", brand: "VIVO", price: 21900, ram: "8GB", storage: "256GB", image: getProductImage("VIVO V2431 V40 LITE") },
  { name: "VIVO V40 LITE 8GB+256GB (DYNAMIC BLACK)", brand: "VIVO", price: 21900, ram: "8GB", storage: "256GB", image: getProductImage("VIVO V40 LITE") },
  { name: "VIVO VIVO V70 ELITE 5G (TITANIUM SILVER)", brand: "VIVO", price: 43200, ram: "8GB", storage: "128GB", image: getProductImage("VIVO VIVO V70 ELITE 5G") },
  { name: "VIVO VIVO V70 ELITE 5G DEMO (TITANIUM SILVER)", brand: "VIVO", price: 43200, ram: "8GB", storage: "128GB", image: getProductImage("VIVO VIVO V70 ELITE 5G DEMO") },
];
