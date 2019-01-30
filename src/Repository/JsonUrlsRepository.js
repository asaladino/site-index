// @flow
import { writeFileSync } from "fs";
import Url from "../Model/Url";

/**
 * Save the urls to a json file.
 */
export default class JsonUrlsRepository {
  /**
   * Build a json url repo.
   */
  file: string;
  constructor(file: string) {
    this.file = file;
  }

  /**
   * Save urls to a json file.
   */
  save(urls: Url[]): Promise<any> {
    return new Promise(resolve => {
      writeFileSync(this.file, JSON.stringify(urls));
      resolve();
    });
  }
}
