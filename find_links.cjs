const https = require('https');
const cheerio = require('cheerio');

https.get('https://berdax-teatr.uz/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const links = [];
    $('a').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && href && !href.startsWith('#')) {
        links.push(`${text}: ${href}`);
      }
    });
    console.log(links.join('\n'));
  });
});
