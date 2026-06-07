const fetch = require('node-fetch');

async function testImage() {
  const urls = [
    'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg',
    'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13.jpg',
    'https://fdn2.gsmarena.com/vv/bigpic/vivo-v30.jpg'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(url, res.status);
    } catch (e) {
      console.error(e);
    }
  }
}

testImage();
