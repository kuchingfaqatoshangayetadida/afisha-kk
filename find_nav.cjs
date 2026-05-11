const https = require('https');
const cheerio = require('cheerio');

https.get('https://berdax-teatr.uz/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const navs = [];
    $('.navigation a, .nav a, nav a, .menu a').each((i, el) => {
      navs.push($(el).text().trim() + ' -> ' + $(el).attr('href'));
    });
    console.log(navs);
  });
});
