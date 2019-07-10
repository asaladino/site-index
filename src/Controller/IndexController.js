// @flow
import CrawlService from '../Service/CrawlService.js';
import SitemapService from '../Service/SitemapService.js';

import Logger from '../Utility/Logger.js';
import Args from '../Model/Args.js';

export default class IndexController {
    args: Args;
    logger: Logger;

    constructor(args: Args) {
        this.args = args;
        this.logger = new Logger(args);
    }

    start(callback): Promise<void> {
        return new Promise((resolve, reject) => {
            this.args.output.doesFolderExist();

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
            if(this.args.isSeedWithSitemap()) {
                let sitemapService = new SitemapService(this.args);
                sitemapService
                    .on('progress', progress => {
                        callback('progress', progress);
                        this.logger.report(progress.toLog());
                        if (this.args.verbose) {
                            console.log(`Seeding: ${progress.toString()}`);
                        }
                    })
                    .on('complete', (count) => {
                        callback('complete');
                        if (this.args.verbose) {
                            console.log(`Done Seeding. Starting the pool with ${count} urls.`);
                        }
                        crawlService.start();
                    });
                sitemapService.start();
            } else {
                crawlService.start();
            }
        });
    }
}
