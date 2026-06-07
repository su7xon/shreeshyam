const https = require('https');
const PID = 'mobile-171f0';
const KEY = 'AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI';

const url = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/products?pageSize=3&key=${KEY}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (!json.documents) {
      console.log('No documents found or error:', JSON.stringify(json, null, 2));
      return;
    }
    json.documents.slice(0, 3).forEach((doc) => {
      const id = doc.name.split('/').pop();
      const f = doc.fields || {};
      console.log('ID:', id);
      console.log('All fields:', Object.keys(f).join(', '));
      console.log('name:', f.name ? f.name.stringValue : 'MISSING');
      console.log('price:', f.price ? (f.price.integerValue || f.price.doubleValue) : 'MISSING');
      console.log('brand:', f.brand ? f.brand.stringValue : 'MISSING');
      console.log('ram:', f.ram ? f.ram.stringValue : 'MISSING');
      console.log('storage:', f.storage ? f.storage.stringValue : 'MISSING');
      console.log('---');
    });
  });
}).on('error', (e) => console.error(e));
