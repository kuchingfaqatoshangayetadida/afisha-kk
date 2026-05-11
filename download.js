import https from 'https';
import fs from 'fs';

https.get('https://berdax-teatr.uz/afishaqq/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('page.html', data);
    console.log('done');
  });
});
