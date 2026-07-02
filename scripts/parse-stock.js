const fs = require('fs');

const parseStock = () => {
  const html = fs.readFileSync('Current Stock Report (1).xls', 'utf8');
  const rows = html.split('<tr>');
  
  const parsed = [];
  
  rows.forEach(r => {
    const tds = r.match(/<td>(.*?)<\/td>/g);
    if (tds && tds.length >= 7) {
      const category = tds[2].replace(/<\/?td>/g, '').trim();
      const brand = tds[3].replace(/<\/?td>/g, '').trim();
      const model = tds[4].replace(/<\/?td>/g, '').trim();
      const color = tds[5].replace(/<\/?td>/g, '').trim();
      const qty = parseInt(tds[6].replace(/<\/?td>/g, '').trim()) || 0;
      const amtText = tds[7] ? tds[7].replace(/<\/?td>/g, '').trim() : '0';
      const amt = parseFloat(amtText.replace(/,/g, '')) || 0;
      
      // Calculate unit price if qty > 0
      const unitPrice = qty > 0 ? Math.round(amt / qty) : 0;
      
      if (category && brand && model && qty > 0 && unitPrice > 0) {
        parsed.push({
          category,
          brand,
          model,
          color,
          qty,
          totalAmount: amt,
          price: unitPrice
        });
      }
    }
  });
  
  fs.writeFileSync('public/parsed-stock.json', JSON.stringify(parsed, null, 2));
  console.log(`Parsed ${parsed.length} items with positive quantity and price. Saved to public/parsed-stock.json`);
};

parseStock();
