const fs = require('fs');

try {
  // Read JSON
  const rawJson = fs.readFileSync('d:\\downloadss\\shreeshyam mobiles\\All_Brands_Price_List (1).json', 'utf8');
  const jsonData = JSON.parse(rawJson);

  // Flatten JSON products into an array
  const jsonProducts = [];
  for (const brand in jsonData.brands) {
    jsonData.brands[brand].forEach(p => {
      jsonProducts.push({
        name: p.product_name.trim().toLowerCase(),
        ram: p.ram_gb ? p.ram_gb + 'GB' : null,
        storage: p.storage_gb ? p.storage_gb + 'GB' : null,
        price: p.selling_price
      });
    });
  }

  // Read MD
  const mdContent = fs.readFileSync('C:\\Users\\LENOVO LOQ\\.gemini\\antigravity-ide\\brain\\de8cded4-e201-4ffe-a0ba-883116fd2810\\product_list.md', 'utf8');
  const mdLines = mdContent.split('\n').filter(l => l.startsWith('|') && !l.includes('|---|'));
  mdLines.shift(); // Remove header

  const mdProducts = [];
  mdLines.forEach(line => {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 6) {
      const name = parts[1].toLowerCase();
      const priceStr = parts[3].replace('₹', '').replace(/,/g, '');
      const price = parseInt(priceStr, 10);
      const ram = parts[4] === '-' ? null : parts[4];
      const storage = parts[5] === '-' ? null : parts[5];
      mdProducts.push({ name, price, ram, storage });
    }
  });

  let diffCount = 0;
  let exactMatches = 0;
  let differences = [];

  jsonProducts.forEach(jp => {
    // Find matching product in the MD list
    const match = mdProducts.find(mp => 
      mp.name.includes(jp.name) || jp.name.includes(mp.name)
    );

    if (match) {
      // If we find a close name match, we check if price is different
      if (match.price !== jp.price) {
        differences.push(`- **${jp.name.toUpperCase()}**: JSON = ₹${jp.price} | Database = ₹${match.price} | (Difference: ₹${Math.abs(jp.price - match.price)})`);
        diffCount++;
      } else {
        exactMatches++;
      }
    }
  });

  let report = `# Price Comparison Report\n\n`;
  report += `Total JSON Products: ${jsonProducts.length}\n`;
  report += `Total Database Products: ${mdProducts.length}\n`;
  report += `Price Differences Found: ${diffCount}\n\n`;
  
  if (diffCount > 0) {
    report += `### Price Mismatches\n`;
    report += differences.join('\n');
  } else {
    report += `**No price differences found among matched products!**`;
  }

  fs.writeFileSync('C:\\Users\\LENOVO LOQ\\.gemini\\antigravity-ide\\brain\\de8cded4-e201-4ffe-a0ba-883116fd2810\\price_comparison.md', report);
  console.log(`Comparison done! Differences found: ${diffCount}`);

} catch (e) {
  console.error("Error:", e);
}
