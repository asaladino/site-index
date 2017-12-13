const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');

const menu = require('./src/Model/Menu');
const Args = require('./src/Model/Args');
const CrawlService = require('./src/Service/CrawlService');
const SitemapService = require('./src/Service/SitemapService');

let args = new Args(commandLineArgs(menu[1]['optionList']));

if (args.shouldShowHelp()) {
    console.log(getUsage(menu));
} else {
    args.output.doesFolderExist();
    if (args.isCrawl()) {
        let crawlService = new CrawlService(args);
        crawlService.start();
    } else {
        let sitemapService = new SitemapService(args);
        sitemapService.start();
    }
}