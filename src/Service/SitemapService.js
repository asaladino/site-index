// @flow
import Service from "./Service.js";
import SitemapRepository from "../Repository/SitemapRepository.js";
import SqliteCrawlStatesRepository from "../Repository/SqliteCrawlStatesRepository";

/**
 * This service will extract all the urls from a sitemap or nested sitemaps.
 */
export default class SitemapService extends Service {
    /**
     * Start the sitemap service to extract the domain urls from the sitemap.
     * Assumes the sitemap is located at the domain + /sitemap.xml
     */
    start() {
        let sitemapRepository = new SitemapRepository("http://" + this.args.domain + "/sitemap.xml");
        let crawlStatesRepository = new SqliteCrawlStatesRepository(this.getProjectPath());
        sitemapRepository
            .findAllPages(progress => this.emitProgress(progress))
            .then(urls => {
                urls.forEach(url => crawlStatesRepository.addPoolUrl(url.url));
                this.emitComplete(urls.length);
            });
    }
}
