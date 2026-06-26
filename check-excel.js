const fs = require('fs');
const xlsx = require('xlsx');

async function checkExcel() {
  try {
    // 1. Fetch the missing products
    const rawJson = fs.readFileSync('d:\\downloadss\\shreeshyam mobiles\\All_Brands_Price_List (1).json', 'utf8');
    const jsonData = JSON.parse(rawJson);
    const oldJsonNames = [];
    for (const brand in jsonData.brands) {
      jsonData.brands[brand].forEach(p => {
        oldJsonNames.push((p.product_name || '').toLowerCase().trim());
      });
    }

    const rawStock = fs.readFileSync('d:\\downloadss\\CurrentStockReport.json', 'utf8');
    const stockData = JSON.parse(rawStock);
    const newJsonNames = [];
    stockData.forEach(item => {
      if (item.MODEL) newJsonNames.push(item.MODEL.toLowerCase().trim());
    });

    const res = await fetch('http://localhost:3000/api/export-products');
    const dbData = await res.json();
    const dbProducts = dbData.products;

    const problemProducts = [];

    dbProducts.forEach(fp => {
      const fpName = (fp.name || '').toLowerCase().trim();
      if (fpName.length < 2) return;
      
      const inOldJson = oldJsonNames.some(oldName => fpName.includes(oldName) || oldName.includes(fpName));
      const inNewJson = newJsonNames.some(newName => fpName.includes(newName) || newName.includes(fpName));

      if (!inOldJson && !inNewJson) {
        problemProducts.push(fp);
      }
    });

    console.log(`Searching for ${problemProducts.length} missing products in Excel...`);

    // 2. Read the Excel file
    const workbook = xlsx.readFile('d:\\downloadss\\stock_report.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Parse sheet to JSON array
    const excelData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
    console.log(`Parsed ${excelData.length} rows from Excel.`);

    // Check which ones are found
    const foundInExcel = [];
    const stillMissing = [];

    // Let's dump all values from Excel into a massive string to do loose searches
    const excelString = JSON.stringify(excelData).toLowerCase();

    problemProducts.forEach(fp => {
      const fpName = (fp.name || '').toLowerCase().trim();
      
      if (excelString.includes(fpName)) {
        foundInExcel.push(fp);
      } else {
        // Try breaking name into words
        const words = fpName.split(' ');
        let matches = 0;
        words.forEach(w => {
          if (w.length > 3 && excelString.includes(w)) matches++;
        });
        
        if (words.length > 0 && matches >= Math.ceil(words.length / 2)) {
           foundInExcel.push(fp);
        } else {
           stillMissing.push(fp);
        }
      }
    });

    console.log(`\nResults:`);
    console.log(`Found in Excel: ${foundInExcel.length}`);
    console.log(`STILL MISSING: ${stillMissing.length}`);

    if (foundInExcel.length > 0) {
        console.log('\nSample found:');
        foundInExcel.slice(0, 10).forEach(p => console.log(`- ${p.name}`));
    }

  } catch (e) {
    console.error(e);
  }
}

checkExcel();
