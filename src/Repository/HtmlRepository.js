const fs = require('fs');
const Url = require('../Model/Url');
const path = require("path");

/**
 * Save the url html to file.
 */
class HtmlRepository {

    /**
     * Build a json url repo.
     * @param projectFolder {string}
     */
    constructor(projectFolder) {
        /**
         * Location to the html folder in the project.
         * @type {string}
         */
        this.projectFolder = projectFolder;
    }

    /**
     * Save html to a file.
     * @param url {Url}
     * @param html {string}
     * @returns {Promise}
     */
    save(url, html) {
        const file = path.join(this.getProjectsHtmlFolder(), url.name + '.html');
        return new Promise((resolve, reject) => {
            fs.writeFileSync(file, html, function (error) {
                reject(error);
            });
            resolve();
        });
    }

    /**
     * Creates the html folder in the project if it doesn't exist.
     * @returns {string} for the html folder.
     */
    getProjectsHtmlFolder() {
        let projectsPathHtml = path.join(this.projectFolder, 'html');
        if (!fs.existsSync(projectsPathHtml)) {
            fs.mkdirSync(projectsPathHtml);
        }
        return projectsPathHtml;
    }
}

module.exports = HtmlRepository;