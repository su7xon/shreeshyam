const google = require('googlethis');

async function testGoogleThis() {
  const options = {
    page: 0, 
    safe: false, 
    additional_params: { 
      hl: 'en' 
    }
  };

  try {
    const query = 'Samsung Galaxy S24 Ultra site:gsmarena.com';
    const response = await google.image(query, options);
    console.log(response.slice(0, 3));
  } catch (e) {
    console.error(e);
  }
}

testGoogleThis();
