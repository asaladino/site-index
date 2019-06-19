import { writeFileSync, existsSync, mkdirSync } from "fs";
import Url from "../Model/Url.js";
import { join } from "path";
/**
 * Save the url html to file.
 */

export default class HeadersRepository {
  /**
   * Location to the headers folder in the project.
   */

  /**
   * Build a json url repo.
   */
  constructor(projectFolder) {
    this.projectFolder = projectFolder;
  }
  /**
   * Save html to a file.
   */


  save(url, headers) {
    const file = join(this.getProjectsHeadersFolder(), url.name + ".json");
    return new Promise(resolve => {
      writeFileSync(file, JSON.stringify(headers));
      resolve();
    });
  }
  /**
   * Creates the html folder in the project if it doesn't exist.
   */


  getProjectsHeadersFolder() {
    let projectsPathHeaders = join(this.projectFolder, "headers");

    if (!existsSync(projectsPathHeaders)) {
      mkdirSync(projectsPathHeaders);
    }

    return projectsPathHeaders;
  }

}
//# sourceMappingURL=HeadersRepository.js.map