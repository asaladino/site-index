const Service = require('./Service');
const Progress = require('../Model/Progress');
const JsonUrlsRepository = require('../Repository/JsonUrlsRepository');
const CrawlerRepository = require('../Repository/CrawlerRepository');
const HtmlRepository = require('../Repository/HtmlRepository');
const CrawlStatesRepository = require("../Repository/CrawlStatesRepository");

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
        let crawlStatesRepository = new CrawlStatesRepository(this.getProjectPath());
        crawlerRepository.crawlState = crawlStatesRepository.read();
        if (this.args.isSingle()) {
            crawlerRepository.crawlState.urlsPool = [this.args.getSingleUrl()];
        }
        crawlerRepository.findAllUrls(/** @type {Progress} */progress => {
            this.emitProgress(progress);
            crawlStatesRepository.save(progress.crawlState);
            if (this.args.html) {
                htmlRepository.save(progress.url, progress.html).then();
            }
        }).then(urls => {
            urlsRepository.save(urls).then();
        });
    }
}

module.exports = CrawlService;