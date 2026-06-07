const fetch = require('node-fetch');
const fs = require('fs');

async function test() {
  const url = `https://m.gsmarena.com/res.php3?sSearch=samsung+galaxy+s24+ultra`;
  const res = await fetch(url, {
      headers: { 
          'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
      }
  });
  const html = await res.text();
  fs.writeFileSync('gsm_html.html', html);
  console.log('Saved to gsm_html.html, size:', html.length);
}

test();
