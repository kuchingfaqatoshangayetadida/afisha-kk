const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function scrape() {
  try {
    const mainHtml = await fetchPage('https://berdax-teatr.uz/main/');
    const $m = cheerio.load(mainHtml);
    const aboutText = $m('.full-text, .full-content, article, #content, .content').text().trim().substring(0, 1000);
    console.log('About text excerpt:', aboutText);

    const novostiHtml = await fetchPage('https://berdax-teatr.uz/novosti/');
    const $n = cheerio.load(novostiHtml);
    const news = [];
    $n('.col4, .post-item, .item, .short, .col-md-4, .col-sm-6, article').each((i, el) => {
      const title = $n(el).find('h5 a, h4 a, h3 a, h2 a').first().text().trim();
      if (title) news.push(title);
    });
    console.log('News titles:', news.slice(0, 10));

  } catch (err) {
    console.error(err);
  }
}

scrape();
