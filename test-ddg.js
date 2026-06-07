const https = require('https');

function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        ...options.headers
      },
      method: options.method || 'GET',
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ _raw: data, _status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function searchImageDDG(query) {
  try {
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
    const html = await new Promise((resolve, reject) => {
      https.get(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(d));
      }).on('error', reject);
    });
    
    const vqdMatch = html.match(/vqd="([^"]+)"/);
    if (!vqdMatch) {
      console.log('No vqd match found. HTML excerpt:', html.slice(0, 500));
      return null;
    }
    const vqd = vqdMatch[1];

    const imgUrl = `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,`;
    const imgData = await fetchJSON(imgUrl);
    
    if (imgData.results && imgData.results.length > 0) {
      return imgData.results[0].image;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function run() {
  const img1 = await searchImageDDG('Samsung Galaxy S24 Ultra site:gsmarena.com');
  console.log('Result 1:', img1);
}

run();
