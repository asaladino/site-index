const CrawlService = require('../Service/CrawlService');
const SitemapService = require('../Service/SitemapService');
const Progress = require('../Model/Progress');

class IndexController {

    constructor(args) {
        this.args = args;
        this.logger = new (require('../Utility/Logger'))(args);
    }

    start() {
        return new Promise((resolve, reject) => {
            this.args.output.doesFolderExist();
            if (this.args.isCrawl() || this.args.isSingle()) {
                let crawlService = new CrawlService(this.args);
                crawlService
                    .on('progress', /** @type Progress */progress => {
                        this.logger.report(progress.toLog());
                        if (this.args.verbose) {
                            console.log(progress.toString());
                        }
                    })
                    .on('complete', () => {
                        console.log('Done');
                        resolve();
                    });
                crawlService.start();
            } else {
                let sitemapService = new SitemapService(args);
                sitemapService
                    .on('progress', /** @type Progress */progress => {
                        this.logger.report(progress.toLog());
                        if (this.args.verbose) {
                            console.log(progress.toString());
                        }
                    })
                    .on('complete', () => {
                        console.log('Done');
                        resolve();
                    });
                sitemapService.start();
            }
        });
    }

}

module.exports = IndexController;