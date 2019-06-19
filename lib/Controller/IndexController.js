import CrawlService from '../Service/CrawlService.js';
import SitemapService from '../Service/SitemapService.js';
import Logger from '../Utility/Logger.js';
import Args from '../Model/Args.js';
export default class IndexController {
  constructor(args) {
    this.args = args;
    this.logger = new Logger(args);
  }

  start(callback = (event, progress) => {}) {
    return new Promise((resolve, reject) => {
      this.args.output.doesFolderExist();

      if (this.args.isCrawl() || this.args.isSingle()) {
        let crawlService = new CrawlService(this.args);
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
        let sitemapService = new SitemapService(this.args);
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
//# sourceMappingURL=IndexController.js.map