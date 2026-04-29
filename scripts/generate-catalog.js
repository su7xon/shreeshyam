const fs = require('fs');
const path = require('path');

const currentProducts = JSON.parse(fs.readFileSync('scratch/current_products.json', 'utf8'));

const output = `// Auto-generated Massive Catalog from Firestore
import { Product } from './data';

export const expandedProducts: Product[] = ${JSON.stringify(currentProducts, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../lib/expanded-catalog.ts'), output);
console.log(`Successfully generated lib/expanded-catalog.ts with ${currentProducts.length} products!`);
