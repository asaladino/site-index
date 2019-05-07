// @flow
import Service from "./Service";
import Progress from "../Model/Progress";
import JsonUrlsRepository from "../Repository/JsonUrlsRepository";
import CrawlerRepository from "../Repository/CrawlerRepository";
import HtmlRepository from "../Repository/HtmlRepository";

import SqliteCrawlStatesRepository from "../Repository/SqliteCrawlStatesRepository";
import HeadersRepository from "../Repository/HeadersRepository";

/**
 * This service will extract all the urls from a domain by crawling a site.
 */
export default class CrawlService extends Service {
    /**
     * Start the crawl service to extract the domain urls.
     */
    start() {
        let urlsRepository = new JsonUrlsRepository(this.getPathJsonUrlsFile());
        let htmlRepository = new HtmlRepository(this.getProjectPath());
        let headersRepository = new HeadersRepository(this.getProjectPath());
        let crawlerRepository = new CrawlerRepository(this.args, this.option);

        let crawlStatesRepository = new SqliteCrawlStatesRepository(
            this.getProjectPath()
        );
        crawlerRepository.crawlStatesRepository = crawlStatesRepository;

        const initUrl = this.args.getSingleUrl();
        if (this.args.isSingle() && initUrl != null) {
            crawlStatesRepository.initUrlsPool([initUrl]);
        }
        crawlerRepository
            .findAllUrls((progress: Progress) => {
                this.emitProgress(progress);
                if (this.args.html && progress.url != null && progress.html != null) {
                    htmlRepository.save(progress.url, progress.html).then();
                }
                if (this.args.headers && progress.url != null && progress.headers != null) {
                    headersRepository.save(progress.url, progress.headers).then();
                }
            })
            .then(urls => {
                urlsRepository.save(urls).then(() => this.emitComplete());
            });
    }
}
