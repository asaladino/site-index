const fs = require("fs");
const path = require("path");

class Service {

    constructor(args) {
        this.args = args;
    }

    getProjectPath() {
        let siteName = this.args.domain.replace(/[.]/g, '_');
        let projectPath = path.join(this.args.output.filename, siteName);
        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
        }
        return projectPath;
    }

    getUrlsPath() {
        let urlsPath = path.join(this.getProjectPath(), 'urls');
        if (!fs.existsSync(urlsPath)) {
            fs.mkdirSync(urlsPath);
        }
        return urlsPath;
    }
}

module.exports = Service;