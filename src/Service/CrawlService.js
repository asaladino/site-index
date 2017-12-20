const Service = require('./Service');
const Progress = require('../Model/Progress');
const JsonUrlsRepository = require('../Repository/JsonUrlsRepository');
const CrawlerRepository = require('../Repository/CrawlerRepository');
const path = require("path");

class CrawlService extends Service {
    start() {
        let urlsRepository = new JsonUrlsRepository(path.join(this.getUrlsPath(), 'urls.json'));
        let crawlerRepository = new CrawlerRepository(this.args.domain);
        crawlerRepository.findAllUrls(/** @type {Progress} */progress => {
            console.log(progress.sitemaps + ' | ' + progress.urls + ' :: retrieving: ' + progress.url);
            if(this.args.html) {
                //console.log('save: ' + progress.html);
            }
        }).then((urls) => {
            urlsRepository.save(urls).then(() => {
                console.log('Done. Saved: ' + urls.length);
            });
        });
    }
}

module.exports = CrawlService;