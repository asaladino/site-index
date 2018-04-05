const CrawlState = require('../Model/CrawlState');
const fs = require('fs');
const path = require("path");

/**
 * Read and write the current crawl state to file.
 */
class CrawlStatesRepository {

    constructor(projectFolder) {
        this.projectFolder = projectFolder;
        this.file = path.join(this.getProjectsUrlFolder(), 'crawl_state.json');
    }

    /**
     * Read the crawl state from file.
     * @return {CrawlState}
     */
    read() {
        if (!fs.existsSync(this.file)) {
            this.save(new CrawlState());
        }
        let crawlState = fs.readFileSync(this.file).toString();
        if (crawlState === "") {
            return new CrawlState();
        }
        return JSON.parse(crawlState);
    }

    /**
     * Save the crawl state to file.
     * @param crawlState {CrawlState} to save to file.
     */
    save(crawlState) {
        return new Promise((resolve) => {
            fs.writeFileSync(this.file, JSON.stringify(crawlState));
            resolve();
        });
    }

    /**
     * Creates the urls folder in the project if it doesn't exist.
     * @returns {string} for the html folder.
     */
    getProjectsUrlFolder() {
        let projectsPathHtml = path.join(this.projectFolder, 'urls');
        if (!fs.existsSync(projectsPathHtml)) {
            fs.mkdirSync(projectsPathHtml);
        }
        return projectsPathHtml;
    }
}

module.exports = CrawlStatesRepository;