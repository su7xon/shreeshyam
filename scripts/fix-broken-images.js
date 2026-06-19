const https = require('https');
const http = require('http');
const google = require('googlethis');

const PROJECT_ID = 'mobile-171f0';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`;

async function searchImageGoogle(query) {
  try {
    const options = {
      page: 0, 
      safe: false, 
      additional_params: { hl: 'en' }
    };
    const response = await google.image(query, options);
    if (response && response.length > 0) {
      for (const res of response) {
        const url = res.url;
        // Exclude unsplash, placeholder, and samsung.com (since they block hotlinking)
        if (!url.includes('unsplash') && !url.includes('placeholder') && !url.includes('images.samsung.com')) {
          return url;
        }
      }
    }
  } catch (e) {}
  return null;
}

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
  console.log('Fetching products to fix specific bad names...');
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

  const testNames = [
    "NOTHING PHONELITE", "HOT 40I", "RENO 15 PRO", "EDGE 60 FU", 
    "TAB A9 4/64", "A56 8+256", "TAB S9 ULTRA", "TAB S9+ (12/256)", 
    "X300 5G", "TAB S10 LITE", "TAB S9 (8/128)", "TAB S10 ULTRA", 
    "TAB A9 PLUS 4/64", "SPARK 50 5G", "REALME 15 5G", "TAB A11", 
    "REALME P4 PRO", "TAB S9-FE", "TAB A11 PLUS", "TAB S10+", "TAB S10"
  ];
  
  const toFix = allDocs.filter(doc => {
    const name = doc.fields?.name?.stringValue || '';
    const isBadPhone = testNames.some(tn => name.includes(tn));
    return isBadPhone;
  });

  console.log(`Found ${toFix.length} products to fix.`);

  let fixed = 0;
  for (const doc of toFix) {
    let name = doc.fields?.name?.stringValue || '';
    let brand = doc.fields?.brand?.stringValue || '';
    const docPath = doc.name;
    
    let cleanName = name.split('(')[0]
                        .replace(/[0-9]+\+[0-9]+/g, '')
                        .replace(/[0-9]+GB/gi, '')
                        .replace(/SERIES/i, '')
                        .replace(/ - /g, ' ')
                        .trim();

    // Map future models to current ones for better image results
    if (name.includes('NOTHING PHONELITE')) { brand = 'Nothing'; cleanName = 'Phone 2a'; }
    if (name.includes('HOT 40I')) { brand = 'Infinix'; cleanName = 'Hot 40i'; }
    if (name.includes('RENO 15 PRO')) { brand = 'Oppo'; cleanName = 'Reno 12 Pro'; }
    if (name.includes('EDGE 60 FU')) { brand = 'Motorola'; cleanName = 'Edge 50 Fusion'; }
    if (name.includes('TAB A9')) { brand = 'Samsung'; cleanName = 'Galaxy Tab A9'; }
    if (name.includes('TAB A9 PLUS')) { brand = 'Samsung'; cleanName = 'Galaxy Tab A9+'; }
    if (name.includes('A56')) { brand = 'Samsung'; cleanName = 'Galaxy A55'; }
    if (name.includes('TAB S9 ULTRA')) { brand = 'Samsung'; cleanName = 'Galaxy Tab S9 Ultra'; }
    if (name.includes('TAB S9+')) { brand = 'Samsung'; cleanName = 'Galaxy Tab S9+'; }
    if (name.includes('TAB S9 (8/128)')) { brand = 'Samsung'; cleanName = 'Galaxy Tab S9'; }
    if (name.includes('X300 5G')) { brand = 'Vivo'; cleanName = 'X100 5G'; }
    if (name.includes('TAB S10 LITE')) { brand = 'Samsung'; cleanName = 'Galaxy Tab S9 FE'; }
    if (name.includes('TAB S10 ULTRA')) { brand = 'Samsung'; cleanName = 'Galaxy Tab S9 Ultra'; }
    if (name.includes('TAB S10+')) { brand = 'Samsung'; cleanName = 'Galaxy Tab S9+'; }
    if (name.includes('SPARK 50 5G')) { brand = 'Tecno'; cleanName = 'Spark 20 Pro 5G'; }
    if (name.includes('REALME 15 5G')) { brand = 'Realme'; cleanName = 'Realme 13 5G'; }
    if (name.includes('TAB A11')) { brand = 'Samsung'; cleanName = 'Galaxy Tab A9'; }
    if (name.includes('REALME P4 PRO')) { brand = 'Realme'; cleanName = 'Realme P1 Pro'; }
    if (name.includes('TAB S9-FE')) { brand = 'Samsung'; cleanName = 'Galaxy Tab S9 FE'; }

    console.log(`Searching real image for: ${brand} ${cleanName}`);
    let newImage = await searchImageGoogle(`${brand} ${cleanName} phone front view -site:images.samsung.com`);
    
    if (!newImage) {
        newImage = await searchImageGoogle(`${brand} ${cleanName} flipkart`);
    }

    if (newImage) {
      const updateUrl = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=image&updateMask.fieldPaths=images`;
      const updateBody = {
        fields: {
          image: { stringValue: newImage },
          images: {
            arrayValue: {
              values: [ { stringValue: newImage } ]
            }
          }
        }
      };
      try {
        const res = await httpsPatch(updateUrl, updateBody);
        if (res.status === 200) {
          fixed++;
          console.log(`✅ Fixed [${fixed}/${toFix.length}] ${name} -> ${newImage}`);
        } else {
          console.log(`❌ Failed ${name}: ${res.status}`);
        }
      } catch (e) {
        console.log(`❌ Failed ${name}: ${e.message}`);
      }
    } else {
        console.log(`⚠️ Could not find image for ${name}`);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`Done! Fixed ${fixed} broken images.`);
}

main().catch(console.error);
