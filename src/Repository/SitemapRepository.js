// @flow
import request from "then-request";
import {parseString} from "xml2js";
import Progress from "../Model/Progress";
import Url from "../Model/Url";

/**
 * Get all the urls from the sitemaps.
 */
export default class SitemapRepository {
    /**
     * The initial sitemap url.
     */
    initialUrl: string;
    /**
     * Array of the site maps to search. This list gets popped and will be empty.
     */
    sitemaps: string[];
    /**
     * Array of all the urls found.
     */
    urls: Url[];

    progress: Progress => void;

    resolve: (Url[]) => void;

    reject: () => void;

    /**
     * Build a sitemap repository
     */
    constructor(initialSitemap: string) {
        this.initialUrl = initialSitemap;
        this.sitemaps = [];
        this.urls = [];
    }

    /**
     * Find all the urls on a sitemap.
     */
    findAllPages(progress: Progress => void): Promise<Url[]> {
        this.progress = progress;
        if (this.sitemaps.length === 0) {
            this.sitemaps.push(this.initialUrl);
        }
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.parseSiteMap();
        });
    }

    /**
     * Gets the sitemap, if there are more sitemaps it will add them to the list
     * else, just adds the urls to the urls array.
     */
    parseSiteMap() {
        let url = this.sitemaps.pop();
        this.progress(new Progress(new Url(url), null, null, this.sitemaps.length, this.urls.length));
        request("GET", url).done(res => {
            let xml = res.getBody("utf8");
            parseString(xml, (err, result) => {
                if (result["urlset"]) {
                    result["urlset"]["url"].forEach(entry => {
                        let url = new Url(entry["loc"][0]);
                        this.urls.push(url);
                    });
                    if (this.sitemaps.length === 0) {
                        this.resolve(this.urls);
                    } else {
                        this.parseSiteMap();
                    }
                }
                if (result["sitemapindex"]) {
                    result["sitemapindex"]["sitemap"].forEach(entry => {
                        this.sitemaps.push(entry["loc"][0]);
                    });
                    this.parseSiteMap();
                }
            });
        });
    }
}
