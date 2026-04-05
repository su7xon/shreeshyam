const fs = require('fs');
let data = fs.readFileSync('./lib/data.ts', 'utf8');

const workingImages = {
  Apple: 'https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg', // iPhone 15 PM
  Samsung: 'https://m.media-amazon.com/images/I/71CXhVhpM0L._SX679_.jpg', // S24 Ultra
  OnePlus: 'https://m.media-amazon.com/images/I/717Qo4MH97L._SX679_.jpg',
  Google: 'https://m.media-amazon.com/images/I/71If178-vNL._SX679_.jpg', // 404! I will use another one
  Generic: 'https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg'
};

const workingUrls = [
  'https://m.media-amazon.com/images/I/81Os1SDWpcL._SX679_.jpg',
  'https://m.media-amazon.com/images/I/71CXhVhpM0L._SX679_.jpg',
  'https://m.media-amazon.com/images/I/717Qo4MH97L._SX679_.jpg',
  'https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg',
  'https://m.media-amazon.com/images/I/61cwywLZR-L._SX679_.jpg'
];

const broken = [
  '71If178-vNL._SX679_.jpg', '811mEb3z81L._SX679_.jpg', '71XmI+-lJwL._SX679_.jpg', '71O3NhRfr2L._SX679_.jpg',
  '61k0H79uLCL._SX679_.jpg', '71lMOGxLiNL._SX679_.jpg', '71JGYTiMNYL._SX679_.jpg',
  '61oLqIMMUjL._SX679_.jpg', '71Hfb5VdsNL._SX679_.jpg', '71JB4oS4JAL._SX679_.jpg',
  '71s4mjiTURL._SX679_.jpg', '71XEg3dEs5L._SX679_.jpg', '71MIniE3WuL._SX679_.jpg',
  '71Hx9xfuq0L._SX679_.jpg', '61mnJq3mJzL._SX679_.jpg', '71TrDLCkKQL._SX679_.jpg',
  '710B8DglYsL._SX679_.jpg', '51GnAz5Z9jL._SX679_.jpg', '71GLMJ2E21L._SX679_.jpg',
  '61kHXxFUi-L._SX679_.jpg', '71AvSnSCgPL._SX679_.jpg', '71BI1-G6v5L._SX679_.jpg', '71MqfMi85hL._SX679_.jpg'
];

broken.forEach((b, i) => {
    let rep = workingUrls[i % workingUrls.length];
    data = data.replace(new RegExp(b.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), rep.split('/').pop());
});

fs.writeFileSync('./lib/data.ts', data);
