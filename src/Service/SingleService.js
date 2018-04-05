const Service = require('./Service');
const Progress = require('../Model/Progress');
const JsonUrlsRepository = require('../Repository/JsonUrlsRepository');
const CrawlerRepository = require('../Repository/CrawlerRepository');
const HtmlRepository = require('../Repository/HtmlRepository');
const CrawlStatesRepository = require("../Repository/CrawlStatesRepository");

/**
 * This service will extract all the urls from a domain by crawling a site.
 */
class SingleService extends Service {

    /**
     * Start the crawl service to extract the domain urls.
     */
    start() {
    }
}

module.exports = SingleService;