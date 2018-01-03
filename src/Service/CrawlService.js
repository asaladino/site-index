const Service = require('./Service');
const Progress = require('../Model/Progress');
const JsonUrlsRepository = require('../Repository/JsonUrlsRepository');
const CrawlerRepository = require('../Repository/CrawlerRepository');
const HtmlRepository = require('../Repository/HtmlRepository');
const path = require("path");

class CrawlService extends Service {
    start() {
        let urlsRepository = new JsonUrlsRepository(path.join(this.getUrlsPath(), 'urls.json'));
        let htmlRepository = new HtmlRepository(this.getProjectPath());
        let crawlerRepository = new CrawlerRepository(this.args.domain);
        crawlerRepository.findAllUrls(/** @type {Progress} */progress => {
            console.log(progress.sitemaps + ' | ' + progress.urls + ' :: retrieving: ' + progress.url.url);
            if(this.args.html) {
                htmlRepository.save(progress.url, progress.html)
                    .then(() => {
                        console.log('Saved html');
                    });
            }
        }).then((urls) => {
            urlsRepository.save(urls).then(() => {
                console.log('Done. Saved: ' + urls.length);
            });
        });
    }
}

module.exports = CrawlService;