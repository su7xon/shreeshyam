// Quick test: Can we scrape phone images from Google?
const https = require('https');

const phones = [
  'Samsung Galaxy A56 5G',
  'Vivo V70 FE 5G',
  'Realme C61',
  'Nothing Phone 2a',
  'Oppo K13X 5G'
];

function searchGoogle(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(query + ' phone image') + '&tbm=isch&udm=2';
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        // Try to extract image URLs from Google Images HTML
        // Google embeds base64 thumbnails and links to originals in scripts
        const patterns = [
          // Pattern 1: Direct image URLs in the page
          /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]/gi,
          // Pattern 2: Image URLs in data attributes
          /data-src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi,
          // Pattern 3: og:image or other meta image tags
          /content="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi,
        ];
        
        const allUrls = [];
        for (const pat of patterns) {
          let match;
          while ((match = pat.exec(d)) !== null) {
            const url = match[1];
            if (url && !url.includes('google.com') && !url.includes('gstatic.com') && url.length < 500) {
              allUrls.push(url);
            }
          }
        }
        
        resolve({ status: res.statusCode, urls: allUrls, htmlLength: d.length });
      });
    }).on('error', reject);
  });
}

// Also test: direct smartprix image URLs
function testSmartprix(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return 'https://d2s48gnndi8j3l.cloudfront.net/' + slug + '-image-1-500x500.jpg';
}

// Also test: phonedb.net (free phone database)
function searchPhoneDB(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://phonedb.net/index.php?m=device&s=list&search=' + encodeURIComponent(query);
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const imgMatch = d.match(/<img[^>]+src="([^"]+)"[^>]*class="[^"]*phone/i);
        resolve({ status: res.statusCode, img: imgMatch ? imgMatch[1] : null, htmlLen: d.length });
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Testing image sources for phone images...\n');
  
  for (const phone of phones) {
    console.log('📱 ' + phone);
    
    // Google
    try {
      const g = await searchGoogle(phone);
      console.log('   Google: status=' + g.status + ', html=' + g.htmlLength + 'b, images=' + g.urls.length);
      if (g.urls.length > 0) console.log('   First: ' + g.urls[0].slice(0, 100));
    } catch (e) {
      console.log('   Google: ERROR ' + e.message);
    }
    
    // Smartprix CDN
    const sp = testSmartprix(phone);
    console.log('   Smartprix CDN: ' + sp);
    
    console.log('');
    
    await new Promise(r => setTimeout(r, 1000));
  }
}

main().catch(console.error);
