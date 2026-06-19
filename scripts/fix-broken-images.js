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
  console.log('Fetching products to fix Samsung broken images and specific bad ones...');
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

  const testNames = ["GALAXY Z FLIP 7", "S25 EDGE", "TAB S10+", "A17", "S26 12+512", "F17 4+128", "M35 5G", "TAB S9+"];
  
  const toFix = allDocs.filter(doc => {
    const name = doc.fields?.name?.stringValue || '';
    const img = doc.fields?.image?.stringValue || '';
    const arr = doc.fields?.images?.arrayValue?.values || [];
    
    // Check for broken samsung images
    const hasBrokenImage = img.includes('images.samsung.com') || arr.some(v => v.stringValue?.includes('images.samsung.com'));
    const isBadPhone = testNames.some(tn => name.includes(tn));
    
    return hasBrokenImage || isBadPhone || img.includes('phonesbot.com');
  });

  console.log(`Found ${toFix.length} products with broken/bad images.`);

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

    // Map some future models to current ones for better image results
    if (cleanName.includes('S26')) cleanName = 'S24 Ultra';
    if (cleanName.includes('Z FLIP 7')) cleanName = 'Z FLIP 6';
    if (cleanName.includes('S25 EDGE')) cleanName = 'S24 Ultra';
    if (cleanName.includes('A17')) cleanName = 'A15 5G';
    if (cleanName.includes('F17')) { cleanName = 'Oppo F17 Pro'; brand = ''; } // override brand for the weird "Samsung F17"

    let shortName = cleanName.split(' ').slice(0, 4).join(' ');

    console.log(`Searching real image for: ${brand} ${shortName}`);
    let newImage = await searchImageGoogle(`${brand} ${shortName} phone front view -site:images.samsung.com`);
    
    if (!newImage) {
        newImage = await searchImageGoogle(`${brand} ${shortName} flipkart`);
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
