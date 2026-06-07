const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function searchGoogle(query) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' site:gsmarena.com')}`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let firstUrl = null;
    $('a').each((i, el) => {
       const href = $(el).attr('href');
       if (href && href.includes('gsmarena.com') && !href.includes('google.com') && href.includes('http')) {
           firstUrl = href;
           return false;
       }
    });
    
    // clean up google redirect url
    if (firstUrl && firstUrl.startsWith('/url?q=')) {
        firstUrl = firstUrl.split('/url?q=')[1].split('&')[0];
    }
    
    console.log("Found URL:", firstUrl);
    
    if (firstUrl) {
      const gsmRes = await fetch(firstUrl, {
         headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const gsmHtml = await gsmRes.text();
      const $$ = cheerio.load(gsmHtml);
      const imgUrl = $$('.specs-photo-main a img').attr('src') || $$('.specs-photo-main img').attr('src');
      return imgUrl;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

searchGoogle('Samsung Galaxy S24 Ultra').then(console.log);
