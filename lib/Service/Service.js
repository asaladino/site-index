import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import OptionsRepository from "../Repository/OptionsRepository.js";
import Args from "../Model/Args.js";
import Option from "../Model/Option.js";
import Progress from "../Model/Progress.js";
/**
 * Base service will events and project folder information.
 */

export default class Service {
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
    const optionsRepository = new OptionsRepository(this.args);
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


  emitComplete() {
    this.events.forEach((callback, event) => {
      if (event === "complete") {
        callback();
      }
    });
  }
  /**
   * Get the full path to the project folder, which is the output folder + domain striped.
   */


  getProjectPath() {
    let siteName = this.args.getSiteName();
    let projectPath = join(this.args.output.filename, siteName);

    if (!existsSync(projectPath)) {
      mkdirSync(projectPath);
    }

    return projectPath;
  }
  /**
   * Get the full path to the urls folder, which is the project path + urls.
   */


  getUrlsPath() {
    let urlsPath = join(this.getProjectPath(), "urls");

    if (!existsSync(urlsPath)) {
      mkdirSync(urlsPath);
    }

    return urlsPath;
  }
  /**
   * Get the path to the urls.json file.
   */


  getPathJsonUrlsFile() {
    return join(this.getUrlsPath(), "urls.json");
  }

}
//# sourceMappingURL=Service.js.map