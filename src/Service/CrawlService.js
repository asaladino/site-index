import Service from "./Service";
import Progress from "../Model/Progress";
import JsonUrlsRepository from "../Repository/JsonUrlsRepository";
import CrawlerRepository from "../Repository/CrawlerRepository";
import HtmlRepository from "../Repository/HtmlRepository";

import SqliteCrawlStatesRepository from "../Repository/SqliteCrawlStatesRepository";

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
    let crawlerRepository = new CrawlerRepository(this.args, this.option);

    let crawlStatesRepository = new SqliteCrawlStatesRepository(
      this.getProjectPath()
    );
    crawlerRepository.crawlStatesRepository = crawlStatesRepository;

    if (this.args.isSingle()) {
      crawlerRepository.initUrlsPool([this.args.getSingleUrl()]);
    }
    crawlerRepository
      .findAllUrls(
        /** @type {Progress} */ progress => {
          this.emitProgress(progress);
          if (this.args.html) {
            htmlRepository.save(progress.url, progress.html).then();
          }
        }
      )
      .then(urls => {
        urlsRepository.save(urls).then(() => this.emitComplete());
      });
  }
}
