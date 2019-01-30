"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Service = _interopRequireDefault(require("./Service"));

var _Progress = _interopRequireDefault(require("../Model/Progress"));

var _JsonUrlsRepository = _interopRequireDefault(require("../Repository/JsonUrlsRepository"));

var _CrawlerRepository = _interopRequireDefault(require("../Repository/CrawlerRepository"));

var _HtmlRepository = _interopRequireDefault(require("../Repository/HtmlRepository"));

var _SqliteCrawlStatesRepository = _interopRequireDefault(require("../Repository/SqliteCrawlStatesRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This service will extract all the urls from a domain by crawling a site.
 */
class CrawlService extends _Service.default {
  /**
   * Start the crawl service to extract the domain urls.
   */
  start() {
    let urlsRepository = new _JsonUrlsRepository.default(this.getPathJsonUrlsFile());
    let htmlRepository = new _HtmlRepository.default(this.getProjectPath());
    let crawlerRepository = new _CrawlerRepository.default(this.args, this.option);
    let crawlStatesRepository = new _SqliteCrawlStatesRepository.default(this.getProjectPath());
    crawlerRepository.crawlStatesRepository = crawlStatesRepository;

    if (this.args.isSingle()) {
      crawlerRepository.initUrlsPool([this.args.getSingleUrl()]);
    }

    crawlerRepository.findAllUrls(
    /** @type {Progress} */
    progress => {
      this.emitProgress(progress);

      if (this.args.html) {
        htmlRepository.save(progress.url, progress.html).then();
      }
    }).then(urls => {
      urlsRepository.save(urls).then(() => this.emitComplete());
    });
  }

}

exports.default = CrawlService;
//# sourceMappingURL=CrawlService.js.map