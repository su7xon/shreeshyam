const { image_search } = require('duckduckgo-images-api');

async function test() {
  try {
    const results = await image_search({ query: 'Samsung Galaxy S24 Ultra site:gsmarena.com', moderate: false });
    console.log(results.slice(0, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
