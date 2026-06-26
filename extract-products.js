const fs = require('fs');
const content = fs.readFileSync('d:/downloadss/shreeshyam mobiles/products-data.ts', 'utf8');

const regex = /name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*price:\s*(\d+),\s*ram:\s*"([^"]+)",\s*storage:\s*"([^"]+)"/g;
let match;
const products = [];
while ((match = regex.exec(content)) !== null) {
  products.push({ name: match[1], brand: match[2], price: parseInt(match[3]), ram: match[4], storage: match[5] });
}

const grouped = {};
products.forEach(p => {
  if (!grouped[p.brand]) grouped[p.brand] = [];
  grouped[p.brand].push(p);
});

const sortedBrands = Object.keys(grouped).sort();

let output = '';
let totalProducts = 0;
sortedBrands.forEach(brand => {
  output += '\n## ' + brand + ' (' + grouped[brand].length + ' products)\n\n';
  output += '| # | Product Name | RAM | Storage | Price |\n';
  output += '|---|---|---|---|---|\n';
  grouped[brand].sort((a, b) => a.price - b.price).forEach((p, i) => {
    totalProducts++;
    output += '| ' + (i+1) + ' | ' + p.name + ' | ' + p.ram + ' | ' + p.storage + ' | Rs.' + p.price.toLocaleString('en-IN') + ' |\n';
  });
});

output = '# ShreeShyam Mobiles - Complete Product Price List\n\n**Total Products: ' + totalProducts + '**\n**Brands: ' + sortedBrands.join(', ') + '**\n' + output;

fs.writeFileSync('d:/downloadss/shreeshyam mobiles/product_price_list.md', output, 'utf8');
console.log('Total products: ' + totalProducts);
console.log('Brands: ' + sortedBrands.join(', '));
console.log('File saved to: product_price_list.md');
