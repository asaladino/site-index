import { writeFileSync } from "fs";

/**
 * Save the urls to a json file.
 */
export default class JsonUrlsRepository {
  /**
   * Build a json url repo.
   * @param file
   */
  constructor(file) {
    this.file = file;
  }

  /**
   * Save urls to a json file.
   * @param urls {[Url]}
   * @returns {Promise}
   */
  save(urls) {
    return new Promise(resolve => {
      writeFileSync(this.file, JSON.stringify(urls));
      resolve();
    });
  }
}
