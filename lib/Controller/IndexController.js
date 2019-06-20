"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CrawlService = _interopRequireDefault(require("../Service/CrawlService.js"));

var _SitemapService = _interopRequireDefault(require("../Service/SitemapService.js"));

var _Logger = _interopRequireDefault(require("../Utility/Logger.js"));

var _Args = _interopRequireDefault(require("../Model/Args.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IndexController {
  constructor(args) {
    this.args = args;
    this.logger = new _Logger.default(args);
  }

  start() {
    let callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (event, progress) => {};
    return new Promise((resolve, reject) => {
      this.args.output.doesFolderExist();

      if (this.args.isCrawl() || this.args.isSingle()) {
        let crawlService = new _CrawlService.default(this.args);
        crawlService.on('progress', progress => {
          callback('progress', progress);
          this.logger.report(progress.toLog());

          if (this.args.verbose) {
            console.log(progress.toString());
          }
        }).on('complete', () => {
          callback('complete');

          if (this.args.verbose) {
            console.log('Done');
          }

          resolve();
        });
        crawlService.start();
      } else {
        let sitemapService = new _SitemapService.default(this.args);
        sitemapService.on('progress', progress => {
          callback('progress', progress);
          this.logger.report(progress.toLog());

          if (this.args.verbose) {
            console.log(progress.toString());
          }
        }).on('complete', () => {
          callback('complete');

          if (this.args.verbose) {
            console.log('Done');
          }

          resolve();
        });
        sitemapService.start();
      }
    });
  }

}

exports.default = IndexController;
//# sourceMappingURL=IndexController.js.map