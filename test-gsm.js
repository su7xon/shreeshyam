const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function getGSMArenaImage(query) {
  try {
    const searchUrl = `https://m.gsmarena.com/res.php3?sSearch=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const searchHtml = await searchRes.text();
    const $ = cheerio.load(searchHtml);
    
    let firstResult = $('.makers ul li a').first().attr('href');
    if (!firstResult) {
      // try another selector for desktop site
      firstResult = $('.makers ul li a').first().attr('href');
      if (!firstResult) {
         console.log('No result found in HTML');
         return null;
      }
    }
    
    const phoneUrl = `https://m.gsmarena.com/${firstResult}`;
    const phoneRes = await fetch(phoneUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const phoneHtml = await phoneRes.text();
    const $$ = cheerio.load(phoneHtml);
    
    const imgUrl = $$('.specs-photo-main a img').attr('src') || $$('.specs-photo-main img').attr('src');
    return imgUrl;
  } catch (e) {
    console.error(e);
    return null;
  }
}

getGSMArenaImage('Samsung Galaxy S24 Ultra').then(img => console.log('Result:', img));
