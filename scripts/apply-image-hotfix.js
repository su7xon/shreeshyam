const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(__dirname, '../lib/services/productService.ts');
let content = fs.readFileSync(FILE_PATH, 'utf-8');

if (!content.includes('overrideProductImage')) {
  // 1. Add imports and helper function at the top
  const importString = `
import { productsData } from '@/products-data';

const overrideProductImage = (product: AdminProduct): AdminProduct => {
  if (!product) return product;
  if (!product.image || product.image.includes('media-amazon.com') || product.image.includes('placeholder') || product.image.includes('placehold.co')) {
    const localMatch = productsData.find(p => p.name.toLowerCase().trim() === (product.name || '').toLowerCase().trim());
    if (localMatch && localMatch.image && !localMatch.image.includes('media-amazon.com')) {
      product.image = localMatch.image;
      if (product.images && product.images.length > 0) {
        product.images[0] = localMatch.image;
      }
    }
  }
  return product;
};
`;
  content = content.replace(
    "const PRODUCTS_COLLECTION = 'products';",
    `const PRODUCTS_COLLECTION = 'products';\n${importString}`
  );

  // 2. Patch getPaginatedProducts
  content = content.replace(
    `    const data = snapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    })) as AdminProduct[];`,
    `    const data = snapshot.docs.map(doc => overrideProductImage({\n      id: doc.id,\n      ...doc.data()\n    } as AdminProduct));`
  );

  // 3. Patch getProductById
  content = content.replace(
    `      return { id: productDoc.id, ...productDoc.data() } as AdminProduct;`,
    `      return overrideProductImage({ id: productDoc.id, ...productDoc.data() } as AdminProduct);`
  );

  // 4. Patch getProductsByIds
  content = content.replace(
    `          results.push({ id: snap.id, ...snap.data() } as AdminProduct);`,
    `          results.push(overrideProductImage({ id: snap.id, ...snap.data() } as AdminProduct));`
  );

  // 5. Patch getFeaturedProducts
  content = content.replace(
    `    const products = querySnapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    })) as AdminProduct[];`,
    `    const products = querySnapshot.docs.map(doc => overrideProductImage({\n      id: doc.id,\n      ...doc.data()\n    } as AdminProduct));`
  );

  // 6. Patch getNewArrivals
  content = content.replace(
    `    const products = querySnapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    })) as AdminProduct[];`,
    `    const products = querySnapshot.docs.map(doc => overrideProductImage({\n      id: doc.id,\n      ...doc.data()\n    } as AdminProduct));`
  );

  // 7. Patch getAllProductsAdmin
  content = content.replace(
    `    return querySnapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    })) as AdminProduct[];`,
    `    return querySnapshot.docs.map(doc => overrideProductImage({\n      id: doc.id,\n      ...doc.data()\n    } as AdminProduct));`
  );

  // 8. Patch searchProducts
  content = content.replace(
    `    return snapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    })) as AdminProduct[];`,
    `    return snapshot.docs.map(doc => overrideProductImage({\n      id: doc.id,\n      ...doc.data()\n    } as AdminProduct));`
  );

  fs.writeFileSync(FILE_PATH, content, 'utf-8');
  console.log('✅ Successfully patched productService.ts with image overrides!');
} else {
  console.log('⚠️ productService.ts is already patched.');
}
