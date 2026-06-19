const https = require('https');
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

  const testNames = ["GALAXY Z FLIP 7", "S25 EDGE", "TAB S10+", "SAMSUNG GALAXY A17", "S26 12+512", "F17 4+128"];
  
  for (const doc of allDocs) {
    const name = doc.fields?.name?.stringValue || '';
    const img = doc.fields?.image?.stringValue || '';
    for (const tn of testNames) {
      if (name.includes(tn)) {
         console.log(`Name: ${name}`);
         console.log(`Image URL: ${img}\n`);
      }
    }
  }
}

main();
