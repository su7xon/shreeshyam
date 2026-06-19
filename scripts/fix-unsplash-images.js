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
        if (!res.url.includes('unsplash') && !res.url.includes('placeholder')) {
          return res.url;
        }
      }
    }
  } catch (e) {
    console.error(`Google search error for "${query}":`, e.message);
  }
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
  console.log('Fetching products to fix Unsplash images...');
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

  const toFix = allDocs.filter(doc => {
    const img = doc.fields?.image?.stringValue || '';
    const arr = doc.fields?.images?.arrayValue?.values || [];
    return img.includes('unsplash.com') || arr.some(v => v.stringValue?.includes('unsplash.com'));
  });

  console.log(`Found ${toFix.length} products with Unsplash fallback image.`);

  let fixed = 0;
  for (const doc of toFix) {
    let name = doc.fields?.name?.stringValue || '';
    const brand = doc.fields?.brand?.stringValue || '';
    const docPath = doc.name;
    
    // Clean name
    let cleanName = name.split('(')[0]
                        .replace(/[0-9]+\+[0-9]+/g, '')
                        .replace(/[0-9]+GB/gi, '')
                        .replace(/SERIES/i, '')
                        .replace(/ - /g, ' ')
                        .trim();

    // Limit to first 3-4 meaningful words to ensure broad match
    let shortName = cleanName.split(' ').slice(0, 3).join(' ');

    console.log(`Searching real image for: ${brand} ${shortName}`);
    let newImage = await searchImageGoogle(`${brand} ${shortName} phone front view site:gsmarena.com`);
    
    if (!newImage) {
        newImage = await searchImageGoogle(`${brand} ${shortName} phone official image`);
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
    
    // Minimal delay since googlethis is pretty robust, but let's be nice
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`Done! Fixed ${fixed} Unsplash images.`);
}

main().catch(console.error);
