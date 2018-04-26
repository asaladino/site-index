const CrawlService = require('../Service/CrawlService');
const SitemapService = require('../Service/SitemapService');

class IndexController {

    constructor(args) {
        this.args = args;
    }

    start() {
        return new Promise((resolve, reject) => {
            this.args.output.doesFolderExist();
            if (this.args.isCrawl() || this.args.isSingle()) {
                let crawlService = new CrawlService(this.args);
                crawlService
                    .on('progress', progress => {
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
                    .on('progress', progress => {
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