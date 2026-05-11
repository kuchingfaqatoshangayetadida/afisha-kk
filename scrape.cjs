const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const pagesToScrape = [
  'https://berdax-teatr.uz/afishaqq/',
  'https://berdax-teatr.uz/afishaqq/page/2/',
  'https://berdax-teatr.uz/afishaqq/page/3/',
  'https://berdax-teatr.uz/afishaqq/page/4/'
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function determineCategory(title) {
  const text = (title || '').toLowerCase();
  if (text.includes('koncert') || text.includes('qosıq') || text.includes('sawǵa')) return 'concert';
  if (text.includes('kino') || text.includes('film')) return 'cinema';
  if (text.includes('festival')) return 'festival';
  if (text.includes('kórme') || text.includes('korgizbe')) return 'exhibition';
  return 'theater';
}

async function scrapeAll() {
  const allEvents = [];
  let eventIdCounter = 1;

  for (const url of pagesToScrape) {
    console.log(`Scraping ${url}...`);
    try {
      const html = await fetchPage(url);
      const $ = cheerio.load(html);

      // The structure seems to have `.p-img` for images and `h5 a` for titles.
      // Usually they are wrapped in a common parent, e.g. a div representing the card.
      $('.col4, .post-item, .item, .short, .col-md-4, .col-sm-6, article').each((i, el) => {
        const titleEl = $(el).find('h5 a');
        const title = titleEl.text().trim();
        if (!title) return; // skip if no title in this element
        
        const pImg = $(el).find('.p-img, .b-img');
        let imgUrl = '';
        if (pImg.length) {
          const style = pImg.attr('style') || '';
          const match = style.match(/url\((.*?)\)/);
          if (match && match[1]) {
            imgUrl = match[1].replace(/['"]/g, '');
          }
        }
        
        if (!imgUrl) {
           const imgEl = $(el).find('img');
           imgUrl = imgEl.attr('src');
        }

        if (imgUrl && !imgUrl.startsWith('http')) {
          if (imgUrl.startsWith('/')) {
            imgUrl = 'https://berdax-teatr.uz' + imgUrl;
          } else {
            imgUrl = 'https://berdax-teatr.uz/' + imgUrl;
          }
        }

        // Replace "medium/" with "" to get high res if possible
        imgUrl = imgUrl ? imgUrl.replace('/medium/', '/') : '';

        if (title && imgUrl && imgUrl.includes('uploads/posts')) {
          const category = determineCategory(title);
          allEvents.push({
            id: `scraped-${eventIdCounter++}`,
            title,
            description: title + ' - Berdaq atındaǵı teatr afishası',
            bannerImage: imgUrl,
            category: category,
            date: '2026-06-15', // dummy
            time: '18:00',
            location: 'Berdaq atındaǵı teatr',
            price: '50,000 UZS',
            isTopEvent: false
          });
        }
      });

      // If the above structured selector fails, we can just do a parallel array extraction if they are siblings
      if (allEvents.length === 0) {
        const titles = [];
        $('h5 a').each((i, el) => titles.push($(el).text().trim()));
        const images = [];
        $('.p-img').each((i, el) => {
          const style = $(el).attr('style') || '';
          const match = style.match(/url\((.*?)\)/);
          if (match && match[1]) {
            images.push(match[1].replace(/['"]/g, '').replace('/medium/', '/'));
          } else {
            images.push('');
          }
        });

        for(let i=0; i<Math.min(titles.length, images.length); i++) {
           if(titles[i] && images[i]) {
               const category = determineCategory(titles[i]);
               allEvents.push({
                  id: `scraped-${eventIdCounter++}`,
                  title: titles[i],
                  description: titles[i] + ' - Berdaq atındaǵı teatr afishası',
                  bannerImage: images[i],
                  category: category,
                  date: '2026-06-15',
                  time: '18:00',
                  location: 'Berdaq atındaǵı teatr',
                  price: '40,000 UZS',
                  isTopEvent: false
               });
           }
        }
      }
      
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }

  const uniqueEvents = [];
  const titlesSet = new Set();
  for (const ev of allEvents) {
    if (!titlesSet.has(ev.title)) {
      titlesSet.add(ev.title);
      uniqueEvents.push(ev);
    }
  }

  // Make the first 4 top events
  uniqueEvents.forEach((ev, i) => {
    ev.isTopEvent = i < 4;
  });

  console.log(`Found ${uniqueEvents.length} unique events.`);

  const content = `import { Event } from '../types';

export const STATIC_EVENTS: Event[] = ${JSON.stringify(uniqueEvents, null, 2)};
`;

  fs.writeFileSync('src/lib/data.ts', content);
  console.log('Saved to src/lib/data.ts');
}

scrapeAll();
