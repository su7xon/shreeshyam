const https = require('https');

https.get('https://www.bing.com/images/search?q=Samsung+Galaxy+A56+5G+official+image', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log("Size:", d.length);
    console.log(d.slice(0, 1000));
  });
});
