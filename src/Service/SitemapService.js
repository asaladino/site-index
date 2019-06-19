// @flow
import Service from "./Service.js";
import SitemapRepository from "../Repository/SitemapRepository.js";
import JsonUrlsRepository from "../Repository/JsonUrlsRepository.js";

/**
 * This service will extract all the urls from a sitemap or nested sitemaps.
 */
export default class SitemapService extends Service {
    /**
     * Start the sitemap service to extract the domain urls from the sitemap.
     * Assumes the sitemap is located at the domain + /sitemap.xml
     */
    start() {
        let urlsRepository = new JsonUrlsRepository(this.getPathJsonUrlsFile());
        let sitemapRepository = new SitemapRepository(
            "http://" + this.args.domain + "/sitemap.xml"
        );
        sitemapRepository
            .findAllPages(progress => this.emitProgress(progress))
            .then(urls => {
                urlsRepository.save(urls).then(() => this.emitComplete());
            });
    }
}
