// @flow
import { JSDOM } from "jsdom";
import UrlParser from "url";

import Progress from "../Model/Progress";
import Url from "../Model/Url";
import Args from "../Model/Args";
import Option from "../Model/Option";

import SqliteCrawlStatesRepository from "./SqliteCrawlStatesRepository";

/**
 * This crawler repository will use a domain name as a data-source and extract urls from it.
 */
export default class CrawlerRepository {
  /**
   * The initial sitemap url.
   */
  initialUrl: string;
  /**
   * Arguments passed to the app from the user.
   */
  args: Args;
  /**
   * Options loaded for the crawl.
   */
  option: Option;
  /**
   * Repository to access the crawl state.
   */
  crawlStatesRepository: SqliteCrawlStatesRepository;
  progress: Progress;
  resolve: any;

  /**
   * Build a sitemap repository
   */
  constructor(args: Args, option: Option) {
    this.initialUrl = `http://${args.domain}/`;
    this.args = args;
    this.option = option;
  }

  /**
   * Find all the urls on a site.
   */
  findAllUrls(progress: Progress): Promise<any> {
    this.progress = progress;
    if (this.crawlStatesRepository.urlsPoolSize() === 0) {
      this.crawlStatesRepository.addPoolUrl(this.initialUrl);
    }
    return new Promise<Url[]>(resolve => {
      this.resolve = resolve;
      this.crawlNextUrl();
    });
  }

  /**
   * Gets the page, if there are more pages it will add them to the list
   * else, just adds the urls to the urls array.
   */
  crawlNextUrl() {
    const urlsPoolSize = this.crawlStatesRepository.urlsPoolSize();
    if (urlsPoolSize === 0) {
      return this.resolve(this.crawlStatesRepository.findAllUrls());
    }
    let url = CrawlerRepository.cleanUrl(
      this.crawlStatesRepository.popPoolUrl()
    );
    JSDOM.fromURL(url)
      .then(dom => {
        const newUrl = new Url(url);
        this.crawlStatesRepository.addUrl(newUrl);
        const { innerHTML } = dom.window.document.documentElement;
        const urlsSize = this.crawlStatesRepository.urlsSize();
        this.progress(
          new Progress(newUrl, innerHTML, urlsSize, urlsPoolSize - 1)
        );
        if (this.args.isSingle()) {
          return this.resolve(this.crawlStatesRepository.findAllUrls());
        } else {
          const links = dom.window.document.querySelectorAll("a");
          const length = links.length;
          for (let link of links) {
            let foundUrl = CrawlerRepository.cleanUrl(link.href);
            if (this.isFreshUrl(foundUrl)) {
              this.crawlStatesRepository.addPoolUrl(foundUrl);
            }
          }
          this.crawlNextUrl();
        }
      })
      .catch(() => {
        this.crawlNextUrl();
      });
  }

  /**
   * Has the url been crawled before?
   * @returns {boolean} true if the url has not been attempted.
   */
  isFreshUrl(url: string) {
    const urls = this.crawlStatesRepository.findAttemptedUrls(url);
    return (
      urls === 0 &&
      this.isInDomain(url) &&
      this.isNotExclusion(url) &&
      CrawlerRepository.isNotRecursive(url) &&
      CrawlerRepository.isNotDocument(url)
    );
  }

  /**
   * Check to see if the url should be excluded.
   */
  isNotExclusion(url: string): boolean {
    let path: string = (UrlParser.parse(url): any).urlsParsed;
    for (let exclusion of this.option.index.exclusions) {
      if (path.startsWith(exclusion)) {
        return false;
      }
    }
    return true;
  }

  /**
   * This crawler only crawls html pages so make sure it is not something else.
   * The next version will handle every document type.
   */
  static isNotDocument(url: string): boolean {
    return (
      !url.endsWith(".pdf") &&
      !url.endsWith(".jpg") &&
      !url.endsWith(".png") &&
      !url.endsWith(".gif") &&
      !url.endsWith(".doc")
    );
  }

  /**
   * Some sites I have crawled urls that are recursive and grow without a 404 being thrown. This
   * method attempts to avoid those pages.
   */
  static isNotRecursive(url: string): boolean {
    let uri = url.replace(/(https|http):/i, "").split("/");
    const entries = uri.splice(3, uri.length);
    for (let entry of entries) {
      const found = entries.filter(e => e === entry).length;
      if (found > 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * The index will only crawl urls on the given domain.
   */
  isInDomain(url: string): boolean {
    return url
      .replace(/(https|http):/i, "")
      .startsWith("//" + this.args.domain);
  }

  /**
   * Remove url params and hashes. They can lead to recursion.
   */
  static cleanUrl(url: string): string {
    return url.split("?")[0].split("#")[0];
  }
}
