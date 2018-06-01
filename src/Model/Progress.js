const Url = require('./Url');
const CrawlState = require('./CrawlState');

/**
 * Class for reporting the progress.
 */
class Progress {

    /**
     * Build a progress object.
     * @param url {Url|null} current url
     * @param html {String|null} for the current url.
     * @param crawlState {CrawlState|null} left to progress through.
     * @param message {String|null} Message to display.
     */
    constructor(url = null, html = null, crawlState = null, message = null) {
        this.url = url;
        this.html = html;
        this.crawlState = crawlState;
        this.message = message;
    }

    /**
     * Build a progress with a message only.
     * @param message {String} to display.
     * @returns {Progress} that was built.
     */
    static buildWithMessage(message) {
        let progress = new Progress();
        progress.message = message;
        return progress;
    }

    /**
     * Display something meaning full about the progress.
     * @returns {String}
     */
    toString() {
        if(this.url !== null) {
            return this.crawlState.urlsPool.length + ' | ' + this.crawlState.urls.length + ' :: retrieving: ' + this.url.url;
        }
        return this.message;
    }

    /**
     * Something to report in the logs.
     * @return {{urlsPoolLength: number, urlsLength: number, url: string}}
     */
    toLog() {
        return {
            urlsPoolLength:  this.crawlState.urlsPool.length,
            urlsLength: this.crawlState.urls.length,
            url: this.url.url
        }
    }
}

module.exports = Progress;