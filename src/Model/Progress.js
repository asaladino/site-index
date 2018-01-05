const Url = require('./Url');

/**
 * Class for reporting the progress.
 */
class Progress {

    /**
     * Build a progress object.
     * @param url {Url|null} current url
     * @param html {string|null} for the current url.
     * @param sitemaps {Number|null} left to progress through.
     * @param urls {Number|null} found.
     * @param message {String|null} Message to display.
     */
    constructor(url = null, html = null, sitemaps = null, urls = null, message = null) {
        this.url = url;
        this.html = html;
        this.sitemaps = sitemaps;
        this.urls = urls;
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
            return this.sitemaps + ' | ' + this.urls + ' :: retrieving: ' + this.url.url;
        }
        return this.message;
    }
}

module.exports = Progress;