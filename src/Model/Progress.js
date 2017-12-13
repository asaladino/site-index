/**
 * Class for reporting the progress.
 */
class Progress {

    /**
     * Build a progress object.
     * @param url {string} current url
     * @param sitemaps {Number} left to progress through.
     * @param urls {Number} found.
     */
    constructor(url, sitemaps, urls) {
        this.url = url;
        this.sitemaps = sitemaps;
        this.urls = urls;
    }
}

module.exports = Progress;