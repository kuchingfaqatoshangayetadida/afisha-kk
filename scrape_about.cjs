const https = require('https');
const cheerio = require('cheerio');

https.get('https://berdax-teatr.uz/istorija-teatra/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    console.log($('.full-text, .full-content, article, #content, .content').text().trim().substring(0, 500));
  });
});
