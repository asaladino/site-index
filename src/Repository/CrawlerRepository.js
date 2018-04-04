let CrawlState = require('../Model/CrawlState');

let Progress = require('../Model/Progress');
let Url = require('../Model/Url');
let Args = require('../Model/Args');
let Option = require('../Model/Option');

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const UrlParser = require('url');

/**
 * This crawler repository will use a domain name as a datasource and extract urls from it.
 */
class CrawlerRepository {

    /**
     * Build a sitemap repository
     * @param args {Args}
     * @param option {Option}
     */
    constructor(args, option) {
        /**
         * The initial sitemap url.
         * @type {string}
         */
        this.initialUrl = 'http://' + args.domain;
        /**
         * Arguments passed to the app from the user.
         * @type {Args}
         */
        this.args = args;
        /**
         * Options loaded for the crawl.
         * @type {Option}
         */
        this.option = option;
        /**
         * Track the current crawl state.
         * @type {CrawlState}
         */
        this.crawlState = new CrawlState(this.initialUrl);
    }

    /**
     * Find all the urls on a site.
     * @returns {Promise}
     */
    findAllUrls(progress) {
        this.progress = progress;
        if (this.crawlState.urlsPool.length === 0) {
            this.crawlState.urlsPool.push(this.initialUrl);
        }
        return new Promise(resolve => {
            this.resolve = resolve;
            this.crawlNextUrl();
        });
    }

    /**
     * Gets the page, if there are more pages it will add them to the list
     * else, just adds the urls to the urls array.
     */
    crawlNextUrl() {
        if (this.crawlState.urlsPool.length === 0) {
            return this.resolve(this.crawlState.urls);
        }
        let url = CrawlerRepository.cleanUrl(this.crawlState.urlsPool.pop());
        JSDOM.fromURL(url).then(dom => {
            const newUrl = new Url(url);
            this.progress(new Progress(newUrl, dom.window.document.documentElement.innerHTML, this.crawlState));
            this.crawlState.urls.push(newUrl);
            const links = dom.window.document.querySelectorAll("a");
            for (let link of links) {
                let foundUrl = CrawlerRepository.cleanUrl(link.href);
                if (this.isFreshUrl(foundUrl)) {
                    this.addFreshUrl(foundUrl);
                }
            }
            this.crawlNextUrl();
        }).catch(() => {
            this.crawlNextUrl();
        });
    }

    /**
     * Add a url that has not been checked.
     * @param url {string} to check later.
     */
    addFreshUrl(url) {
        this.crawlState.urlsPool.push(url);
        this.crawlState.urlsAttempted.push(url);
    }

    /**
     * Has the url been crawled before?
     * @param url {string} to check.
     * @returns {boolean} true if the url has not been attempted.
     */
    isFreshUrl(url) {
        return this.crawlState.urlsAttempted.filter(p => p === url).length === 0
            && this.isInDomain(url)
            && this.isNotExclusion(url)
            && CrawlerRepository.isNotRecursive(url)
            && CrawlerRepository.isNotDocument(url)
    }

    /**
     * Check to see if the url should be excluded.
     * @param url {string} to check.
     * @returns {boolean} true if the url is not excluded.
     */
    isNotExclusion(url) {
        let urlParsed = UrlParser.parse(url);
        for (let exclusion of this.option.index.exclusions) {
            if (urlParsed.path.startsWith(exclusion)) {
                return false;
            }
        }
        return true;
    }

    /**
     * This crawler only crawls html pages so make sure it is not something else.
     *
     * The next version will handle every document type.
     *
     * @param url {string} to check.
     * @returns {boolean} true if the url is not a document.
     */
    static isNotDocument(url) {
        return !url.endsWith('.pdf')
            && !url.endsWith('.jpg')
            && !url.endsWith('.png')
            && !url.endsWith('.gif')
            && !url.endsWith('.doc');
    }

    /**
     * Some sites I have crawled urls that are recursive and grow without a 404 being thrown. This
     * method attempts to avoid those pages.
     * @param url {string} to check.
     * @returns {boolean} true if the url is not recursive.
     */
    static isNotRecursive(url) {
        let uri = url.replace(/(https|http):/i, '').split('/');
        const entries = uri.splice(3, uri.length);
        for (let entry of entries) {
            const found = entries.filter(e => e === entry).length;
            if (found > 1) {
                return false;
            }
        }
        return true;
    }

    /**
     * The index will only crawl urls on the given domain.
     * @param url {string} to check.
     * @returns {boolean} true if it is on the domain.
     */
    isInDomain(url) {
        return url.replace(/(https|http):/i, '').startsWith('//' + this.args.domain);
    }

    /**
     * Remove url params and hashes. They can lead to recursion.
     * @param url {string} to clean.
     * @returns {string} a url without params and hashes.
     */
    static cleanUrl(url) {
        return url.split('?')[0].split('#')[0];
    }
}

module.exports = CrawlerRepository;