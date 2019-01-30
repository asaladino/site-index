// @flow
import CrawlService from '../Service/CrawlService';
import SitemapService from '../Service/SitemapService';

import Logger from '../Utility/Logger';
import Args from '../Model/Args';

export default class IndexController {
  args: Args;
  logger: Logger;

  constructor(args: Args) {
    this.args = args;
    this.logger = new Logger(args);
  }

  start(callback: function = (event, progress) => {}): Promise<void> {
    return new Promise((resolve, reject) => {
      this.args.output.doesFolderExist();
      if (this.args.isCrawl() || this.args.isSingle()) {
        let crawlService = new CrawlService(this.args);
        crawlService
          .on('progress', progress => {
            callback('progress', progress);
            this.logger.report(progress.toLog());
            if (this.args.verbose) {
              console.log(progress.toString());
            }
          })
          .on('complete', () => {
            callback('complete');
            if (this.args.verbose) {
              console.log('Done');
            }
            resolve();
          });
        crawlService.start();
      } else {
        let sitemapService = new SitemapService(this.args);
        sitemapService
          .on('progress', progress => {
            callback('progress', progress);
            this.logger.report(progress.toLog());
            if (this.args.verbose) {
              console.log(progress.toString());
            }
          })
          .on('complete', () => {
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
