"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

var _OptionsRepository = _interopRequireDefault(require("../Repository/OptionsRepository.js"));

var _Args = _interopRequireDefault(require("../Model/Args.js"));

var _Option = _interopRequireDefault(require("../Model/Option.js"));

var _Progress = _interopRequireDefault(require("../Model/Progress.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base service will events and project folder information.
 */
class Service {
  /**
   * Received from the user.
   */

  /**
   * Events emitted by the services.
   */

  /**
   * Options loaded for the crawl.
   */

  /**
   * Build a service with some arguments.
   */
  constructor(args) {
    this.args = args;
    this.events = new Map();
    const optionsRepository = new _OptionsRepository.default(this.args);
    this.option = optionsRepository.getOption();
  }
  /**
   * Added an event watcher.
   * @param event {string} name of the event.
   *  options: progress,complete
   * @param callback {Function} when an event is emitted.
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
      if (event === "progress") {
        callback(progress);
      }
    });
  }
  /**
   * Emit that the service has completed it's job.
   */


  emitComplete(count) {
    this.events.forEach((callback, event) => {
      if (event === "complete") {
        callback(count);
      }
    });
  }
  /**
   * Get the full path to the project folder, which is the output folder + domain striped.
   */


  getProjectPath() {
    let siteName = this.args.getSiteName();
    let projectPath = (0, _path.join)(this.args.output.filename, siteName);

    if (!(0, _fs.existsSync)(projectPath)) {
      (0, _fs.mkdirSync)(projectPath);
    }

    return projectPath;
  }
  /**
   * Get the full path to the urls folder, which is the project path + urls.
   */


  getUrlsPath() {
    let urlsPath = (0, _path.join)(this.getProjectPath(), "urls");

    if (!(0, _fs.existsSync)(urlsPath)) {
      (0, _fs.mkdirSync)(urlsPath);
    }

    return urlsPath;
  }
  /**
   * Get the path to the urls.json file.
   */


  getPathJsonUrlsFile() {
    return (0, _path.join)(this.getUrlsPath(), "urls.json");
  }
  /**
   * Get the path to the urls.csv file.
   */


  getPathCsvUrlsFile() {
    return (0, _path.join)(this.getUrlsPath(), "urls.csv");
  }

}

exports.default = Service;
//# sourceMappingURL=Service.js.map