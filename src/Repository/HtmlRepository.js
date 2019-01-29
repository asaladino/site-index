import { writeFileSync, existsSync, mkdirSync } from "fs";
import Url from "../Model/Url";
import { join } from "path";

/**
 * Save the url html to file.
 */
export default class HtmlRepository {
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
    const file = join(this.getProjectsHtmlFolder(), url.name + ".html");
    return new Promise(resolve => {
      writeFileSync(file, html);
      resolve();
    });
  }

  /**
   * Creates the html folder in the project if it doesn't exist.
   * @returns {string} for the html folder.
   */
  getProjectsHtmlFolder() {
    let projectsPathHtml = join(this.projectFolder, "html");
    if (!existsSync(projectsPathHtml)) {
      mkdirSync(projectsPathHtml);
    }
    return projectsPathHtml;
  }
}
