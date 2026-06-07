const fetch = require('node-fetch');

async function testApi() {
  try {
    const res = await fetch('https://api-mobilespecs.azharimm.dev/v2/search?query=samsung%20galaxy%20s24%20ultra');
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error('API failed:', e.message);
  }
}

testApi();
