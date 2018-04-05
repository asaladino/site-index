/**
 * Records the current last state of the crawl.
 */
class CrawlState {
    /**
     * Initialize a crawl state with a url.
     * @param initialUrl to start the state.
     */
    constructor(initialUrl) {
        /**
         * Array of pages to check for more links. This list gets popped and will be empty.
         * @type {[string]}
         */
        this.urlsPool = [];
        /**
         * List of urls that have been attempted, so we don't get unending crawls.
         * @type {[string]}
         */
        this.urlsAttempted = [initialUrl];
        /**
         * Array of all the urls found.
         * @type {[Url]}
         */
        this.urls = [];
    }
}

module.exports = CrawlState;