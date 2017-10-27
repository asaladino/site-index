let SitemapRepository = require('./Repository/SitemapRepository');
let JsonUrlsRepository = require('./Repository/JsonUrlsRepository');

let sitemapRepository = new SitemapRepository('https://www.sfccmo.edu/sitemap.xml');
let urlsRepository = new JsonUrlsRepository('output/urls.json');

sitemapRepository.findAllPages((progress) => {
    console.log('Retrieving: ' + progress.url);
}).then((urls) => {
    urlsRepository.save(urls).then(() => {
        console.log('Done. Saved: ' + urls.length);
    });
});