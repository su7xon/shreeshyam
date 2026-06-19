const https = require('https');
const fs = require('fs');

const PROJECT_ID = 'mobile-171f0';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`;

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching all products...');
  let allDocs = [];
  let nextToken = null;
  do {
    let url = `${BASE_URL}?pageSize=300`;
    if (nextToken) url += `&pageToken=${nextToken}`;
    const resp = await httpsGet(url);
    const data = JSON.parse(resp);
    if (data.documents) allDocs = allDocs.concat(data.documents);
    nextToken = data.nextPageToken || null;
  } while (nextToken);

  console.log(`Fetched ${allDocs.length} products.`);
  
  const products = allDocs.map(doc => {
    return {
      name: doc.fields?.name?.stringValue || '',
      price: doc.fields?.price?.numberValue || parseInt(doc.fields?.price?.stringValue || '0', 10),
      discountedPrice: doc.fields?.discountedPrice?.numberValue || parseInt(doc.fields?.discountedPrice?.stringValue || '0', 10),
    };
  });

  fs.writeFileSync('scratch/product-prices.json', JSON.stringify(products, null, 2));
  console.log('Saved to scratch/product-prices.json');
}

main().catch(console.error);
