/**
 * Records the current last state of the crawl.
 */
class CrawlState {
    /**
     * Initialize a crawl state with a url.
     */
    constructor() {
        /**
         * Array of pages to check for more links. This list gets popped and will be empty.
         * @type {[string]}
         */
        this.urlsPool = [];
        /**
         * List of urls that have been attempted, so we don't get unending crawls.
         * @type {[string]}
         */
        this.urlsAttempted = [];
        /**
         * Array of all the urls found.
         * @type {[Url]}
         */
        this.urls = [];
    }
}

module.exports = CrawlState;