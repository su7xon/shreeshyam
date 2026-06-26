import { expandedProducts } from './lib/expanded-catalog';

const list = expandedProducts.map((p: { name: string; price: number; ram: string; storage: string }) => ({
  name: p.name,
  price: p.price,
  ram: p.ram,
  storage: p.storage,
}));

console.log(JSON.stringify(list, null, 2));
