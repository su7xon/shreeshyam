const https = require('https');

const PROJECT_ID = 'mobile-171f0';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products`;

const nameMappings = {
  "NOTHING PHONELITE 8GB/128GB": "Nothing Phone Lite (8GB/128GB)",
  "Infinix X6528 HOT 40I": "Infinix Hot 40i",
  "RENO SERIES - RENO 15 PRO MI": "OPPO Reno 15 Pro",
  "Motorola XT2503-2 EDGE 60 FU": "Motorola Edge 60 Fusion",
  "X115NA (TAB A9 4/64) LTE 4+64": "Samsung Galaxy Tab A9 LTE (4GB/64GB)",
  "A56 8+256": "Samsung Galaxy A56 5G (8GB/256GB)",
  "X916BA TAB S9 ULTRA (12/256)": "Samsung Galaxy Tab S9 Ultra (12GB/256GB)",
  "X810NA TAB S9+ (12/256) WIFI": "Samsung Galaxy Tab S9+ Wi-Fi (12GB/256GB)",
  "Vivo X300 5G": "Vivo X300 5G",
  "X400NA (TAB S10 LITE 6/128) WIFI": "Samsung Galaxy Tab S10 Lite Wi-Fi (6GB/128GB)",
  "X716BA TAB S9 (8/128) 5G LTE": "Samsung Galaxy Tab S9 5G (8GB/128GB)",
  "X920NE TAB S10 ULTRA (12/512) WIFI": "Samsung Galaxy Tab S10 Ultra Wi-Fi (12GB/512GB)",
  "X216BA (TAB A9 PLUS 4/64) LTE 4+64": "Samsung Galaxy Tab A9+ LTE (4GB/64GB)",
  "X910NE TAB S9 ULTRA (12/512) WIFI": "Samsung Galaxy Tab S9 Ultra Wi-Fi (12GB/512GB)",
  "X926BE TAB S10 ULTRA (12/512) LTE": "Samsung Galaxy Tab S10 Ultra 5G (12GB/512GB)",
  "SPARK 50 5G (6+128) (KN8) 6+128": "Tecno Spark 50 5G (6GB/128GB)",
  "REALME 15 5G 12+256": "Realme 15 5G (12GB/256GB)",
  "SPARK 50 5G (4+128) (KN8) 4+128": "Tecno Spark 50 5G (4GB/128GB)",
  "X133NA (TAB A11 4/64) WIFI 4+64": "Samsung Galaxy Tab A11 Wi-Fi (4GB/64GB)",
  "X920NA TAB S10 ULTRA (12/256)": "Samsung Galaxy Tab S10 Ultra Wi-Fi (12GB/256GB)",
  "X816BA TAB S9+ (12/256) 5G": "Samsung Galaxy Tab S9+ 5G (12GB/256GB)",
  "X916BE TAB S9 ULTRA (12/512) 5G": "Samsung Galaxy Tab S9 Ultra 5G (12GB/512GB)",
  "REALME P4 PRO 5G 8+256": "Realme P4 Pro 5G (8GB/256GB)",
  "X516BA (TAB S9-FE 6/128) LTE": "Samsung Galaxy Tab S9 FE LTE (6GB/128GB)",
  "X230NA (TAB A11 PLUS 6/128) WIFI": "Samsung Galaxy Tab A11 Plus Wi-Fi (6GB/128GB)",
  "X710NA TAB S9 (8/128) WIFI": "Samsung Galaxy Tab S9 Wi-Fi (8GB/128GB)",
  "X820NA TAB S10+ (12/256) WIFI": "Samsung Galaxy Tab S10+ Wi-Fi (12GB/256GB)"
};

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
  console.log('Fetching products to fix bad names...');
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

  const badNames = Object.keys(nameMappings);
  
  const toFix = allDocs.filter(doc => {
    const name = doc.fields?.name?.stringValue || '';
    return badNames.some(bad => name.includes(bad));
  });

  console.log(`Found ${toFix.length} products to fix names for.`);

  let fixed = 0;
  for (const doc of toFix) {
    const originalName = doc.fields?.name?.stringValue || '';
    const docPath = doc.name;
    
    // Find the correct mapping
    let newName = originalName;
    for (const bad of badNames) {
      if (originalName.includes(bad)) {
        newName = nameMappings[bad];
        // Special case: if the original name had color like " (BLUE)" we could append it,
        // but user mappings seem to be exact replacements for the base name. 
        // Let's just completely replace it if the mapping is available.
        break;
      }
    }

    if (newName && newName !== originalName) {
      const updateUrl = `https://firestore.googleapis.com/v1/${docPath}?updateMask.fieldPaths=name`;
      const updateBody = {
        fields: {
          name: { stringValue: newName }
        }
      };
      try {
        const res = await httpsPatch(updateUrl, updateBody);
        if (res.status === 200) {
          fixed++;
          console.log(`✅ Fixed [${fixed}/${toFix.length}] "${originalName}" -> "${newName}"`);
        } else {
          console.log(`❌ Failed ${originalName}: ${res.status}`);
        }
      } catch (e) {
        console.log(`❌ Failed ${originalName}: ${e.message}`);
      }
      
      await new Promise(r => setTimeout(r, 200));
    }
  }
  console.log(`Done! Fixed ${fixed} names.`);
}

main().catch(console.error);
