"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Service = _interopRequireDefault(require("./Service.js"));

var _Progress = _interopRequireDefault(require("../Model/Progress.js"));

var _JsonUrlsRepository = _interopRequireDefault(require("../Repository/JsonUrlsRepository.js"));

var _CrawlerRepository = _interopRequireDefault(require("../Repository/CrawlerRepository.js"));

var _HtmlRepository = _interopRequireDefault(require("../Repository/HtmlRepository.js"));

var _SqliteCrawlStatesRepository = _interopRequireDefault(require("../Repository/SqliteCrawlStatesRepository.js"));

var _HeadersRepository = _interopRequireDefault(require("../Repository/HeadersRepository.js"));

var _CsvUrlsRepository = _interopRequireDefault(require("../Repository/CsvUrlsRepository"));

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
    let csvUrlsRepository = new _CsvUrlsRepository.default(this.getPathCsvUrlsFile());
    let htmlRepository = new _HtmlRepository.default(this.getProjectPath());
    let headersRepository = new _HeadersRepository.default(this.getProjectPath());
    let crawlerRepository = new _CrawlerRepository.default(this.args, this.option, this.getProjectPath());
    let crawlStatesRepository = new _SqliteCrawlStatesRepository.default(this.getProjectPath());
    crawlerRepository.crawlStatesRepository = crawlStatesRepository;
    const initUrl = this.args.getSingleUrl();

    if (this.args.isSingle() && initUrl != null) {
      crawlStatesRepository.initUrlsPool([initUrl]);
    }

    crawlerRepository.findAllUrls(progress => {
      this.emitProgress(progress);

      if (this.args.html && progress.url != null && progress.html != null) {
        htmlRepository.save(progress.url, progress.html).then();
      }

      if (this.args.headers && progress.url != null && progress.headers != null) {
        headersRepository.save(progress.url, progress.headers).then();
      }
    }).then(urls => {
      urlsRepository.save(urls).then(() => this.emitComplete());
      csvUrlsRepository.save(urls).then(() => this.emitComplete());
    });
  }

}

exports.default = CrawlService;
//# sourceMappingURL=CrawlService.js.map