const fs = require('fs');

async function run() {
  try {
    const rawJson = fs.readFileSync('d:\\downloadss\\shreeshyam mobiles\\All_Brands_Price_List (1).json', 'utf8');
    const jsonData = JSON.parse(rawJson);

    const jsonProducts = [];
    for (const brand in jsonData.brands) {
      jsonData.brands[brand].forEach(p => {
        jsonProducts.push({
          name: p.product_name,
          ram: p.ram_gb ? p.ram_gb + 'GB' : null,
          storage: p.storage_gb ? p.storage_gb + 'GB' : null,
          price: p.selling_price,
          original_price: p.original_price
        });
      });
    }

    console.log(`Sending ${jsonProducts.length} products to update API...`);
    
    const res = await fetch('http://localhost:3000/api/update-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonProducts })
    });
    
    const data = await res.json();
    
    if (data.success) {
      console.log(`Successfully updated ${data.updatedCount} products in the database!`);
      if (data.logs && data.logs.length > 0) {
        fs.writeFileSync('C:\\Users\\LENOVO LOQ\\.gemini\\antigravity-ide\\brain\\de8cded4-e201-4ffe-a0ba-883116fd2810\\update_logs.txt', data.logs.join('\n'));
        console.log('Update details saved to update_logs.txt');
      }
    } else {
      console.error('Update failed:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
