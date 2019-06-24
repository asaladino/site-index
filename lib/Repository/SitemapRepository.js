"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _thenRequest = _interopRequireDefault(require("then-request"));

var xml2js = _interopRequireWildcard(require("xml2js"));

var _Progress = _interopRequireDefault(require("../Model/Progress.js"));

var _Url = _interopRequireDefault(require("../Model/Url.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get all the urls from the sitemaps.
 */
class SitemapRepository {
  /**
   * The initial sitemap url.
   */

  /**
   * Array of the site maps to search. This list gets popped and will be empty.
   */

  /**
   * Array of all the urls found.
   */

  /**
   * Where the scan at?
   */

  /**
   * Called with a list of urls that were found on the sitemap.
   */

  /**
   * Report a problem.
   */

  /**
   * Build a sitemap repository
   */
  constructor(initialSitemap) {
    this.initialUrl = initialSitemap;
    this.sitemaps = [];
    this.urls = [];
  }
  /**
   * Find all the urls on a sitemap.
   */


  findAllPages(progress) {
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
    this.progress(new _Progress.default(new _Url.default(url), null, null, this.sitemaps.length, this.urls.length));
    (0, _thenRequest.default)("GET", url).done(res => {
      let xml = res.getBody("utf8");
      xml2js.parseString(xml, (err, result) => {
        if (result["urlset"]) {
          result["urlset"]["url"].forEach(entry => {
            let url = new _Url.default(entry["loc"][0]);
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

exports.default = SitemapRepository;
//# sourceMappingURL=SitemapRepository.js.map