"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _url = _interopRequireDefault(require("url"));

var _axios = _interopRequireDefault(require("axios"));

var _path = _interopRequireWildcard(require("path"));

var _Progress = _interopRequireDefault(require("../Model/Progress.js"));

var _Url = _interopRequireDefault(require("../Model/Url.js"));

var _Args = _interopRequireDefault(require("../Model/Args.js"));

var _Option = _interopRequireDefault(require("../Model/Option.js"));

var _SqliteCrawlStatesRepository = _interopRequireDefault(require("./SqliteCrawlStatesRepository.js"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _fs = require("fs");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
  constructor(args, option, projectPath) {
    this.initialUrl = "http://".concat(args.domain, "/");
    this.args = args;
    this.option = option;
    this.screenshotsPath = this.getScreenshotPath(projectPath);
  }
  /**
   * Find all the urls on a site.
   */


  findAllUrls(progress) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.progress = progress;

      if (_this.crawlStatesRepository.urlsPoolSize() === 0) {
        _this.crawlStatesRepository.addPoolUrl(_this.initialUrl);
      }

      _this.browser = yield _puppeteer.default.launch({
        ignoreHTTPSErrors: true,
        headless: true
      });
      _this.page = yield _this.browser.newPage();

      _this.page.setJavaScriptEnabled(true);

      return new Promise(resolve => {
        _this.resolve = resolve;

        _this.crawlNextUrl();
      });
    })();
  }
  /**
   * Goto the page and get the html contents of the page.
   * @param url of the page.
   * @returns {Promise<void>}
   */


  processPage(url) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.page.goto(url, {
        "waitUntil": "networkidle2"
      });
      const waitForRender = _this2.option.index.waitForRender;

      if (waitForRender) {
        yield _this2.page.waitFor(waitForRender);
      } // Add check for html doc.


      const response = yield (0, _axios.default)(url);
      const content = yield _this2.page.mainFrame().content();
      return {
        headers: response.headers,
        html: content
      };
    })();
  }
  /**
   * Gets the page, if there are more pages it will add them to the list
   * else, just adds the urls to the urls array.
   */


  crawlNextUrl() {
    var _this3 = this;

    const urlsPoolSize = this.crawlStatesRepository.urlsPoolSize();
    const urlsSize = this.crawlStatesRepository.urlsSize();

    if (urlsPoolSize === 0 || urlsSize >= this.args.limit && this.args.limit !== -1) {
      this.browser.close();
      return this.resolve(this.crawlStatesRepository.findAllUrls());
    }

    let url = CrawlerRepository.cleanUrl(this.crawlStatesRepository.popPoolUrl());
    this.processPage(url).then(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (data) {
        const newUrl = new _Url.default(url);

        _this3.crawlStatesRepository.addUrl(newUrl);

        const urlsSize = _this3.crawlStatesRepository.urlsSize();

        _this3.progress(new _Progress.default(newUrl, data.html, data.headers, urlsSize, urlsPoolSize - 1));

        if (urlsSize <= _this3.args.screenshots && _this3.args.screenshots !== -1 || _this3.args.screenshots === -1) {
          _this3.page.screenshot({
            path: _path.default.join(_this3.screenshotsPath, "".concat(newUrl.name, ".png"))
          });
        }

        if (_this3.args.isSingle()) {
          _this3.resolve(_this3.crawlStatesRepository.findAllUrls());
        } else {
          const links = yield _this3.page.$$("a");

          for (let linkHandle of links) {
            const href = yield _this3.page.evaluate(link => link.href, linkHandle);
            let foundUrl = CrawlerRepository.cleanUrl(href);

            if (_this3.isFreshUrl(foundUrl)) {
              _this3.crawlStatesRepository.addPoolUrl(foundUrl);
            }
          }

          _this3.crawlNextUrl();
        }
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()).catch(() => {
      this.crawlNextUrl();
    });
  }
  /**
   * Get the path to the screenshots directory for the project.
   * @param projectPath as a base
   * @returns {string} the screenshots path.
   */


  getScreenshotPath(projectPath) {
    let screenshotsPath = _path.default.join(projectPath, 'screenshots');

    if (!(0, _fs.existsSync)(screenshotsPath)) {
      (0, _fs.mkdirSync)(screenshotsPath);
    }

    return screenshotsPath;
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
    let _UrlParser$parse = _url.default.parse(url),
        path = _UrlParser$parse.path;

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