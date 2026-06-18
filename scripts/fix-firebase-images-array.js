const https = require('https');
const http = require('http');

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

function httpsPatch(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const data = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Fetching products to fix images array...');
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

  const placeholderPatterns = ['media-amazon.com', 'placeholder', 'placehold.co', 'via.placeholder'];

  const toFix = allDocs.filter(doc => {
    const arr = doc.fields?.images?.arrayValue?.values || [];
    return arr.some(v => placeholderPatterns.some(p => v.stringValue?.includes(p)));
  });

  console.log(`Found ${toFix.length} products with broken images array.`);

  let fixed = 0;
  for (const doc of toFix) {
    const img = doc.fields?.image?.stringValue || '';
    const name = doc.fields?.name?.stringValue || '';
    const docPath = doc.name;
    const updateUrl = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=images`;
    const updateBody = {
      fields: {
        images: {
          arrayValue: {
            values: [ { stringValue: img } ]
          }
        }
      }
    };
    try {
      const res = await httpsPatch(updateUrl, updateBody);
      if (res.status === 200) {
        fixed++;
        console.log(`✅ Fixed images array for ${name}`);
      } else {
        console.log(`❌ Failed ${name}: ${res.status} ${res.body}`);
      }
    } catch (e) {
      console.log(`❌ Failed ${name}: ${e.message}`);
    }
  }
  console.log(`Done! Fixed ${fixed} arrays.`);
}

main().catch(console.error);
