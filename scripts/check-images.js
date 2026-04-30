const https = require('https');

const PROJECT_ID = 'mobile-171f0';
const API_KEY    = 'AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'node-check-script' } }, (res) => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { reject(new Error('JSON parse error: ' + d.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
    '/databases/(default)/documents/products?key=' + API_KEY + '&pageSize=20';

  const data = await fetchJSON(url);

  if (!data.documents) {
    console.log('ERROR:', JSON.stringify(data).slice(0, 400));
    return;
  }

  console.log('\nSample product images in Firestore:\n');
  console.log('NAME'.padEnd(45) + 'IMAGE URL (first 90 chars)');
  console.log('-'.repeat(140));

  let noImage = 0, hasImage = 0;

  data.documents.forEach((doc) => {
    const f     = doc.fields || {};
    const name  = (f.name  && f.name.stringValue)  || '(no name)';
    const image = (f.image && f.image.stringValue) || '';

    if (!image) noImage++;
    else hasImage++;

    console.log(name.slice(0, 44).padEnd(45) + (image ? image.slice(0, 90) : '⚠️  NO IMAGE'));
  });

  console.log('\n--- SUMMARY (first 20 docs) ---');
  console.log('Has image : ' + hasImage);
  console.log('No image  : ' + noImage);
  console.log('\nTotal in Firestore: ' + (data.documents ? data.documents.length : 0) + ' (this page)');
}

main().catch(console.error);
