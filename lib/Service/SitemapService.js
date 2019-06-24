"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Service = _interopRequireDefault(require("./Service.js"));

var _SitemapRepository = _interopRequireDefault(require("../Repository/SitemapRepository.js"));

var _SqliteCrawlStatesRepository = _interopRequireDefault(require("../Repository/SqliteCrawlStatesRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This service will extract all the urls from a sitemap or nested sitemaps.
 */
class SitemapService extends _Service.default {
  /**
   * Start the sitemap service to extract the domain urls from the sitemap.
   * Assumes the sitemap is located at the domain + /sitemap.xml
   */
  start() {
    let sitemapRepository = new _SitemapRepository.default("http://" + this.args.domain + "/sitemap.xml");
    let crawlStatesRepository = new _SqliteCrawlStatesRepository.default(this.getProjectPath());
    sitemapRepository.findAllPages(progress => this.emitProgress(progress)).then(urls => {
      urls.forEach(url => crawlStatesRepository.addPoolUrl(url.url));
      this.emitComplete(urls.length);
    });
  }

}

exports.default = SitemapService;
//# sourceMappingURL=SitemapService.js.map