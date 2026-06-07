const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function searchImageDDGHTML(query) {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:gsmarena.com')}`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // duckduckgo html has a result list
    // Usually the first result URL points to GSMArena
    const firstUrl = $('.result__url').first().text().trim();
    console.log("Found URL:", firstUrl);
    
    if (firstUrl) {
      const gsmUrl = 'https://' + firstUrl;
      const gsmRes = await fetch(gsmUrl, {
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

searchImageDDGHTML('Samsung Galaxy S24 Ultra').then(console.log);
