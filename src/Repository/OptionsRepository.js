const fs = require('fs');
const path = require("path");

const Option = require('../Model/Option');
const OptionDefaults = require('../Model/OptionDefaults');
const Args = require('../Model/Args');

/**
 * Save and load options for the index.
 */
class OptionsRepository {
    constructor(args) {
        /**
         * Passed in from the commandline.
         * @type {Args}
         */
        this.args = args;
        /**
         * Path to the options file.
         * @type {string}
         */
        this.file = path.join(this.args.output.filename, 'options', this.args.getSiteName() + '.json');
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

}

module.exports = OptionsRepository;