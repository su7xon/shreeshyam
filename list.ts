import { expandedProducts } from './lib/expanded-catalog';

const list = expandedProducts.map(p => ({
  name: p.name,
  price: p.price,
  ram: p.ram,
  storage: p.storage
}));

console.log(JSON.stringify(list, null, 2));
