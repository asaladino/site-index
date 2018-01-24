const fs = require("fs");
const path = require("path");

const OptionsRepository = require('../Repository/OptionsRepository');

/**
 * Base service will events and project folder information.
 */
class Service {

    /**
     * Build a service with some arguments.
     * @param args {Args} passed from the user.
     */
    constructor(args) {
        /**
         * Received from the user.
         * @type {Args}
         */
        this.args = args;

        /**
         * Events emitted by the services.
         * @type {Map<string, Function>}
         */
        this.events = new Map();

        const optionsRepository = new OptionsRepository(this.args);
        /**
         * Options loaded for the crawl.
         * @type {Option}
         */
        this.option = optionsRepository.getOption();
    }

    /**
     * Added an event watcher.
     * @param event {string} name of the event.
     *  options: progress,complete
     * @param callback {Function} when an event is emitted.
     * @returns {Service} for chaining.
     */
    on(event, callback) {
        this.events.set(event, callback);
        return this;
    }

    /**
     * Emit the progress of the service.
     * @param progress {Progress} of the service.
     */
    emitProgress(progress) {
        this.events.forEach((callback, event) => {
            if (event === 'progress') {
                callback(progress);
            }
        })
    }

    /**
     * Emit that the service has completed it's job.
     */
    emitComplete() {
        this.events.forEach((callback, event) => {
            if (event === 'complete') {
                callback();
            }
        })
    }

    /**
     * Get the full path to the project folder, which is the output folder + domain striped.
     * @returns {string} the full path.
     */
    getProjectPath() {
        let siteName = this.args.getSiteName();
        let projectPath = path.join(this.args.output.filename, siteName);
        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
        }
        return projectPath;
    }

    /**
     * Get the full path to the urls folder, which is the project path + urls.
     * @returns {string} the full path.
     */
    getUrlsPath() {
        let urlsPath = path.join(this.getProjectPath(), 'urls');
        if (!fs.existsSync(urlsPath)) {
            fs.mkdirSync(urlsPath);
        }
        return urlsPath;
    }

    /**
     * Get the path to the urls.json file.
     * @returns {string} the full path.
     */
    getPathJsonUrlsFile() {
        return path.join(this.getUrlsPath(), 'urls.json');
    }
}

module.exports = Service;