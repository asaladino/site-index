const fs = require('fs');
const path = require("path");

const Option = require('../Model/Option');
const OptionDefaults = require('../Assets/OptionDefaults.json');
const Args = require('../Model/Args').default;

/**
 * Save and load options for the index.
 */
class OptionsRepository {
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
        this.file = path.join(this.folder, this.args.getSiteName() + '.json');
    }

    /**
     * Get the option from file or load defaults or load from memory.
     * @returns {Option}
     */
    getOption() {
        if (!this.option) {
            if (fs.existsSync(this.file)) {
                this.option = new Option(JSON.parse(fs.readFileSync(this.file).toString()));
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
        fs.writeFileSync(this.file, JSON.stringify(option, null, 2));
    }

    /**
     * Create the options folder.
     */
    createFolder() {
      const optionsFolder = path.join(this.args.output.filename, 'options');;
      if (!fs.existsSync(optionsFolder)) {
        fs.mkdirSync(optionsFolder);
      }
      return optionsFolder;
    }
}

module.exports = OptionsRepository;