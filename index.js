let SitemapRepository = require('./Repository/SitemapRepository');
let UrlsRepository = require('./Repository/UrlsRepository');

let sitemapRepository = new SitemapRepository('https://www.sitename.com/sitemap.xml');
let urlsRepository = new UrlsRepository('urls.csv');

sitemapRepository.findAllPages((progress) => {
    console.log('Retrieving: ' + progress.url);
}).then((urls) => {
    urlsRepository.save(urls).then(() => {
        console.log('Done. Saved: ' + urls.length);
    });
});
