const Service = require('./Service');
const SitemapRepository = require('../Repository/SitemapRepository');
const JsonUrlsRepository = require('../Repository/JsonUrlsRepository');
const path = require("path");

class SitemapService extends Service {
    start() {
        let urlsRepository = new JsonUrlsRepository(path.join(this.getUrlsPath(), 'urls.json'));
        let sitemapRepository = new SitemapRepository('http://' + this.args.domain + '/sitemap.xml');
        sitemapRepository.findAllPages(progress => {
            console.log('Retrieving: ' + progress.url);
        }).then((urls) => {
            urlsRepository.save(urls).then(() => {
                console.log('Done. Saved: ' + urls.length);
            });
        });
    }
}

module.exports = SitemapService;