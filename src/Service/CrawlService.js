const Service = require('./Service');
const Progress = require('../Model/Progress');
const JsonUrlsRepository = require('../Repository/JsonUrlsRepository');
const CrawlerRepository = require('../Repository/CrawlerRepository');
const HtmlRepository = require('../Repository/HtmlRepository');

/**
 * This service will extract all the urls from a domain by crawling a site.
 */
class CrawlService extends Service {

    /**
     * Start the crawl service to extract the domain urls.
     */
    start() {
        let urlsRepository = new JsonUrlsRepository(this.getPathJsonUrlsFile());
        let htmlRepository = new HtmlRepository(this.getProjectPath());
        let crawlerRepository = new CrawlerRepository(this.args, this.option);
        crawlerRepository.findAllUrls(/** @type {Progress} */progress => {
            this.emitProgress(progress);
            if(this.args.html) {
                htmlRepository.save(progress.url, progress.html)
                    .then(() => {
                        this.emitProgress(Progress.buildWithMessage('Saved html'));
                    });
            }
        }).then(urls => {
            urlsRepository.save(urls).then(() => this.emitComplete());
        });
    }
}

module.exports = CrawlService;