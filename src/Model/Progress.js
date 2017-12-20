const Url = require('./Url');

/**
 * Class for reporting the progress.
 */
class Progress {

    /**
     * Build a progress object.
     * @param url {Url} current url
     * @param html {string} for the current url.
     * @param sitemaps {Number} left to progress through.
     * @param urls {Number} found.
     */
    constructor(url, html, sitemaps, urls) {
        this.url = url;
        this.html = html;
        this.sitemaps = sitemaps;
        this.urls = urls;
    }
}

module.exports = Progress;