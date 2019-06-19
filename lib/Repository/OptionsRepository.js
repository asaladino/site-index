import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import Option from "../Model/Option.js";
import OptionDefaults from "../Assets/OptionDefaults.json";
import Args from "../Model/Args.js";
/**
 * Save and load options for the index.
 */

export default class OptionsRepository {
  /**
   * Passed in from the command-line.
   */

  /**
   * Folder where the options are saved.
   */

  /**
   * Path to the options file.
   */

  /**
   * Options for the site indexing.
   */
  constructor(args) {
    this.args = args;
    this.folder = this.createFolder();
    this.file = join(this.folder, this.args.getSiteName() + ".json");
  }
  /**
   * Get the option from file or load defaults or load from memory.
   */


  getOption() {
    if (this.option == null) {
      if (existsSync(this.file)) {
        this.option = new Option(JSON.parse(readFileSync(this.file).toString()));
      } else {
        this.option = new Option(OptionDefaults);
        this.save(this.option);
      }
    }

    return this.option;
  }
  /**
   * Save the option to file.
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
//# sourceMappingURL=OptionsRepository.js.map