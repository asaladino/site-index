const FileDetails = require('./FileDetails');

class Args {
    constructor(params) {
        /**
         * @type FileDetails
         */
        this.output = null;
        this.type = 'crawl';
        /**
         * Should the html be saved?
         * @type {boolean}
         */
        this.html = false;
        Object.assign(this, params);
    }

    shouldShowHelp() {
        return this.hasOwnProperty('help') || !this.hasOwnProperty('domain') || !this.hasOwnProperty('output');
    }

    isCrawl() {
        return this.type === 'crawl';
    }
}

module.exports = Args;