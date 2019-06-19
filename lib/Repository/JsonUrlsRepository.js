import { writeFileSync } from "fs";
import Url from "../Model/Url.js";
/**
 * Save the urls to a json file.
 */

export default class JsonUrlsRepository {
  /**
   * Build a json url repo.
   */
  constructor(file) {
    this.file = file;
  }
  /**
   * Save urls to a json file.
   */


  save(urls) {
    return new Promise(resolve => {
      writeFileSync(this.file, JSON.stringify(urls));
      resolve();
    });
  }

}
//# sourceMappingURL=JsonUrlsRepository.js.map