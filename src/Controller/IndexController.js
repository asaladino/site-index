const CrawlService = require("../Service/CrawlService");
const SitemapService = require("../Service/SitemapService");

import Logger from '../Utility/Logger';


class IndexController {

  constructor(args) {
    this.args = args;
    this.logger = new Logger(args);
  }

  start(callback = (event, progress) => {}) {
    return new Promise((resolve, reject) => {
      this.args.output.doesFolderExist();
      if (this.args.isCrawl() || this.args.isSingle()) {
        let crawlService = new CrawlService(this.args);
        crawlService
          .on("progress", progress => {
            callback("progress", progress);
            this.logger.report(progress.toLog());
            if (this.args.verbose) {
              console.log(progress.toString());
            }
          })
          .on("complete", () => {
            callback("complete");
            if (this.args.verbose) {
              console.log("Done");
            }
            resolve();
          });
        crawlService.start();
      } else {
        let sitemapService = new SitemapService(args);
        sitemapService
          .on("progress", progress => {
            callback("progress", progress);
            this.logger.report(progress.toLog());
            if (this.args.verbose) {
              console.log(progress.toString());
            }
          })
          .on("complete", () => {
            callback("complete");
            if (this.args.verbose) {
              console.log("Done");
            }
            resolve();
          });
        sitemapService.start();
      }
    });
  }
}

module.exports = IndexController;
