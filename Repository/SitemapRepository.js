let request = require('then-request');
let parseString = require('xml2js').parseString;
let Progress = require('../Model/Progress');

class SitemapRepository {

    constructor(initialSitemap) {
        this.initialSitemap = initialSitemap;

        /**
         * Array of the site maps to search. This list gets popped and will be empty.
         * @type {[string]}
         */
        this.sitemaps = [];

        /**
         * Array of all the pages found.
         * @type {[string]}
         */
        this.pages = [];
    }

    /**
     * Find all the pages on a sitemap.
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

    parseSiteMap() {
        let url = this.sitemaps.pop();
        this.progress(new Progress(url, this.sitemaps.length, this.pages.length));
        request('GET', url).done((res) => {
            let xml = res.getBody('utf8');
            parseString(xml, (err, result) => {
                if (result['urlset']) {
                    result['urlset']['url'].forEach(entry => {
                        this.pages.push(entry['loc'][0]);
                    });
                    if (this.sitemaps.length === 0) {
                        this.resolve(this.pages);
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