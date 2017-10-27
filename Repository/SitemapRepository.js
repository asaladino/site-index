let request = require('then-request');
let parseString = require('xml2js').parseString;
let Progress = require('../Model/Progress');
let Url = require('../Model/Url');

/**
 * Get all the urls from the sitemaps.
 */
class SitemapRepository {

    /**
     * Build a sitemap repository
     * @param initialSitemap {string}
     */
    constructor(initialSitemap) {
        /**
         * The initial sitemap url.
         * @type {string}
         */
        this.initialSitemap = initialSitemap;

        /**
         * Array of the site maps to search. This list gets popped and will be empty.
         * @type {[string]}
         */
        this.sitemaps = [];

        /**
         * Array of all the urls found.
         * @type {[Url]}
         */
        this.urls = [];
    }

    /**
     * Find all the urls on a sitemap.
     * @returns {Promise}
     */
    findAllPages(progress) {
        this.progress = progress;
        if (this.sitemaps.length === 0) {
            this.sitemaps.push(this.initialSitemap);
        }
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.parseSiteMap(resolve, reject);
        });
    }

    /**
     * Gets the sitemap, if there are more sitemaps it will add them to the list
     * else, just adds the urls to the urls array.
     */
    parseSiteMap() {
        let url = this.sitemaps.pop();
        this.progress(new Progress(url, this.sitemaps.length, this.urls.length));
        request('GET', url).done((res) => {
            let xml = res.getBody('utf8');
            parseString(xml, (err, result) => {
                if (result['urlset']) {
                    result['urlset']['url'].forEach(entry => {
                        let url = new Url(entry['loc'][0]);
                        this.urls.push(url);
                    });
                    if (this.sitemaps.length === 0) {
                        this.resolve(this.urls);
                    } else {
                        this.parseSiteMap();
                    }
                }
                if (result['sitemapindex']) {
                    result['sitemapindex']['sitemap'].forEach(entry => {
                        this.sitemaps.push(entry['loc'][0]);
                    });
                    this.parseSiteMap();
                }
            });
        });
    }
}

module.exports = SitemapRepository;