"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsdom = require("jsdom");

var _url = _interopRequireDefault(require("url"));

var _Progress = _interopRequireDefault(require("../Model/Progress"));

var _Url = _interopRequireDefault(require("../Model/Url"));

var _Args = _interopRequireDefault(require("../Model/Args"));

var _Option = _interopRequireDefault(require("../Model/Option"));

var _SqliteCrawlStatesRepository = _interopRequireDefault(require("./SqliteCrawlStatesRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This crawler repository will use a domain name as a data-source and extract urls from it.
 */
class CrawlerRepository {
  /**
   * The initial sitemap url.
   */

  /**
   * Arguments passed to the app from the user.
   */

  /**
   * Options loaded for the crawl.
   */

  /**
   * Repository to access the crawl state.
   */

  /**
   * Build a sitemap repository
   */
  constructor(args, option) {
    this.initialUrl = `http://${args.domain}/`;
    this.args = args;
    this.option = option;
  }
  /**
   * Find all the urls on a site.
   */


  findAllUrls(progress) {
    this.progress = progress;

    if (this.crawlStatesRepository.urlsPoolSize() === 0) {
      this.crawlStatesRepository.addPoolUrl(this.initialUrl);
    }

    return new Promise(resolve => {
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

    let url = CrawlerRepository.cleanUrl(this.crawlStatesRepository.popPoolUrl());

    _jsdom.JSDOM.fromURL(url).then(dom => {
      const newUrl = new _Url.default(url);
      this.crawlStatesRepository.addUrl(newUrl);
      const innerHTML = dom.window.document.documentElement.innerHTML;
      const urlsSize = this.crawlStatesRepository.urlsSize();
      this.progress(new _Progress.default(newUrl, innerHTML, urlsSize, urlsPoolSize - 1));

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
    }).catch(() => {
      this.crawlNextUrl();
    });
  }
  /**
   * Has the url been crawled before?
   * @returns {boolean} true if the url has not been attempted.
   */


  isFreshUrl(url) {
    const urls = this.crawlStatesRepository.findAttemptedUrls(url);
    return urls === 0 && this.isInDomain(url) && this.isNotExclusion(url) && CrawlerRepository.isNotRecursive(url) && CrawlerRepository.isNotDocument(url);
  }
  /**
   * Check to see if the url should be excluded.
   */


  isNotExclusion(url) {
    let path = _url.default.parse(url).urlsParsed;

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


  static isNotDocument(url) {
    return !url.endsWith(".pdf") && !url.endsWith(".jpg") && !url.endsWith(".png") && !url.endsWith(".gif") && !url.endsWith(".doc");
  }
  /**
   * Some sites I have crawled urls that are recursive and grow without a 404 being thrown. This
   * method attempts to avoid those pages.
   */


  static isNotRecursive(url) {
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


  isInDomain(url) {
    return url.replace(/(https|http):/i, "").startsWith("//" + this.args.domain);
  }
  /**
   * Remove url params and hashes. They can lead to recursion.
   */


  static cleanUrl(url) {
    return url.split("?")[0].split("#")[0];
  }

}

exports.default = CrawlerRepository;
//# sourceMappingURL=CrawlerRepository.js.map