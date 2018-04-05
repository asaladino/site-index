const FileDetails = require('./FileDetails');

/**
 * Commandline arguments being passed to the indexer.
 */
class Args {
    constructor(params) {
        /**
         * Project directory to output the index results.
         * @type {FileDetails|null}
         */
        this.output = null;
        /**
         * What type of indexing is taking place: crawl or sitemap?
         * @type {string}
         */
        this.type = 'crawl';
        /**
         * Should the html be saved?
         * @type {boolean}
         */
        this.html = false;
        /**
         * Domain being indexed.
         * @type {string|*}
         */
        this.domain = null;
        /**
         * URI of a single path you want to add to the index.
         * @type {string|*}
         */
        this.uri = null;
        /**
         * Should progress information be output to the console?
         * @type {boolean}
         */
        this.verbose = true;
        Object.assign(this, params);
    }

    /**
     * If the mandatory options are not passed then show the menu.
     * @returns {boolean} true if the mandatory options are not passed.
     */
    shouldShowHelp() {
        return this.hasOwnProperty('help') || (this.domain === null || this.output === null);
    }

    /**
     * Is the indexing going to be a crawl?
     * @returns {boolean} true if it is.
     */
    isCrawl() {
        return this.type === 'crawl';
    }

    /**
     * Adds a single page to the index.
     * @return {boolean}
     */
    isSingle() {
        return this.type === 'single';
    }

    /**
     * Name of the site that is being crawled.
     * @returns {string}
     */
    getSiteName() {
        return this.domain.replace(/[.]/g, '_');
    }
}

module.exports = Args;