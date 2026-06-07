const fetch = require('node-fetch');

async function testImage() {
  try {
    const url = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-u1.jpg';
    const res = await fetch(url);
    console.log('Status:', res.status);
    console.log('Headers:', res.headers.raw());
  } catch (e) {
    console.error(e);
  }
}

testImage();
