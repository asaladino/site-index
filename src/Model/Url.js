/**
 * Url found by a site map. Works with the pa11y-login app.
 */
class Url {

    /**
     * Build a url.
     * @param url {string} found in the sitemap.
     */
    constructor(url) {
        this.name = url.replace(/[^a-zA-Z0-9]/g, '_');
        this.url = url;
        this.fragment = '';
    }
}

module.exports = Url;