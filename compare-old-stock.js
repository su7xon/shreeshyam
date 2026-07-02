const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const rawJson = fs.readFileSync('All_Brands_Price_List (1).json', 'utf8');
const websiteData = JSON.parse(rawJson);
const webProducts = [];
for (const brand in websiteData.brands) {
  websiteData.brands[brand].forEach(p => {
    webProducts.push({
      name: p.product_name.trim().toLowerCase(),
      price: p.selling_price
    });
  });
}

const html = fs.readFileSync('Old Current Stock Report (1).xls', 'utf8');
const $ = cheerio.load(html);

const oldStock = [];
$('tbody tr').each((i, el) => {
  const tds = $(el).find('td');
  if (tds.length >= 8) {
    const category = $(tds[2]).text().trim();
    const brand = $(tds[3]).text().trim();
    const name = $(tds[4]).text().trim();
    const qtyText = $(tds[6]).text().trim();
    const valueText = $(tds[7]).text().trim();
    
    if (name && qtyText && valueText && !name.includes('[TOTAL]')) {
      const qty = parseInt(qtyText, 10);
      const totalValue = parseFloat(valueText);
      if (qty > 0 && !isNaN(totalValue)) {
        const price = totalValue / qty;
        // Basic cleanup of name
        let cleanName = name.toLowerCase().replace(/\s+/g, ' ').trim();
        oldStock.push({ brand, name: cleanName, price, qty });
      }
    }
  }
});

let report = '# Old Stock vs Website Price Comparison\n\n';
report += 'This report compares items from `Old Current Stock Report (1).xls` with the products in `All_Brands_Price_List (1).json` (Website).\n\n';

report += '| Old Stock Name | Old Price | Website Name | Website Price | Difference | Qty |\n';
report += '|---|---|---|---|---|---|\n';

let matches = 0;
let mismatches = 0;
let notFound = 0;

oldStock.forEach(item => {
  let match = webProducts.find(wp => wp.name === item.name);
  if (!match) {
    // Try relaxed matching
    match = webProducts.find(wp => wp.name.includes(item.name) || item.name.includes(wp.name));
  }
  
  if (match) {
    const diff = item.price - match.price;
    report += '| ' + item.name + ' | ₹' + item.price.toFixed(2) + ' | ' + match.name + ' | ₹' + match.price + ' | ₹' + diff.toFixed(2) + ' | ' + item.qty + ' |\n';
    if (Math.abs(diff) < 1) matches++;
    else mismatches++;
  } else {
    report += '| ' + item.name + ' | ₹' + item.price.toFixed(2) + ' | Not Found | - | - | ' + item.qty + ' |\n';
    notFound++;
  }
});

report += '\n### Summary\n';
report += '- **Total Unique Items matched in Old Stock:** ' + oldStock.length + '\n';
report += '- **Price Matches:** ' + matches + '\n';
report += '- **Price Mismatches:** ' + mismatches + '\n';
report += '- **Not Found on Website:** ' + notFound + '\n';

const artifactDir = 'C:\\\\Users\\\\LENOVO\\\\.gemini\\\\antigravity-ide\\\\brain\\\\83e0e9c1-9337-4208-a788-780c71854eb2';
if (fs.existsSync(artifactDir)) {
    fs.writeFileSync(path.join(artifactDir, 'old_stock_comparison.md'), report);
    console.log('Created old_stock_comparison.md in artifacts');
} else {
    fs.writeFileSync('old_stock_comparison.md', report);
    console.log('Created old_stock_comparison.md in current directory');
}
