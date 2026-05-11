const https = require('https');
https.get('https://berdax-teatr.uz/afishaqq/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = [...data.matchAll(/<img src=\"(.*?)\" alt=\"(.*?)\".*?>/g)];
    const titles = [...data.matchAll(/<h[1-6].*?><a href=\".*?\">(.*?)<\/a><\/h[1-6]>/g)];
    const items = [];
    // Just grab any image that looks like a poster
    const posterImages = matches.filter(m => m[1].includes('uploads/posts'));
    console.log("Images found:", posterImages.map(m => m[1]).slice(0, 5));
    console.log("Titles found:", titles.map(m => m[1]).slice(0, 5));
  });
});
