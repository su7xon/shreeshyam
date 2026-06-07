const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function searchBing(query) {
  try {
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query + ' site:gsmarena.com')}&form=HDRSC2`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let firstUrl = null;
    $('a.iusc').each((i, el) => {
       const mAttr = $(el).attr('m');
       if (mAttr) {
           try {
               const mData = JSON.parse(mAttr);
               if (mData.murl && mData.murl.includes('gsmarena.com')) {
                   firstUrl = mData.murl;
                   return false; // break
               }
           } catch (e) {}
       }
    });
    
    console.log("Found URL:", firstUrl);
    return firstUrl;
  } catch (e) {
    console.error(e);
  }
  return null;
}

searchBing('Samsung Galaxy S24 Ultra').then(console.log);
