import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

import Option from "../Model/Option";
import OptionDefaults from "../Assets/OptionDefaults.json";
import Args from "../Model/Args";

/**
 * Save and load options for the index.
 */
export default class OptionsRepository {
  constructor(args) {
    /**
     * Passed in from the command-line.
     * @type {Args}
     */
    this.args = args;
    /**
     * Folder where the options are saved.
     */
    this.folder = this.createFolder();
    /**
     * Path to the options file.
     * @type {string}
     */
    this.file = join(this.folder, this.args.getSiteName() + ".json");
  }

  /**
   * Get the option from file or load defaults or load from memory.
   * @returns {Option}
   */
  getOption() {
    if (!this.option) {
      if (existsSync(this.file)) {
        this.option = new Option(
          JSON.parse(readFileSync(this.file).toString())
        );
      } else {
        this.option = new Option(OptionDefaults);
        this.save(this.option);
      }
    }
    return this.option;
  }

  /**
   * Save the option to file.
   * @param option {Option}
   */
  save(option) {
    writeFileSync(this.file, JSON.stringify(option, null, 2));
  }

  /**
   * Create the options folder.
   */
  createFolder() {
    const optionsFolder = join(this.args.output.filename, "options");
    if (!existsSync(optionsFolder)) {
      mkdirSync(optionsFolder);
    }
    return optionsFolder;
  }
}
