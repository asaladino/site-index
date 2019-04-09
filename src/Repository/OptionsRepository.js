// @flow
import {existsSync, readFileSync, writeFileSync, mkdirSync} from "fs";
import {join} from "path";

import Option from "../Model/Option";
import OptionDefaults from "../Assets/OptionDefaults.json";
import Args from "../Model/Args";

/**
 * Save and load options for the index.
 */
export default class OptionsRepository {
    /**
     * Passed in from the command-line.
     */
    args: Args;
    /**
     * Folder where the options are saved.
     */
    folder: string;
    /**
     * Path to the options file.
     */
    file: string;
    /**
     * Options for the site indexing.
     */
    option: Option;

    constructor(args: Args) {
        this.args = args;
        this.folder = this.createFolder();
        this.file = join(this.folder, this.args.getSiteName() + ".json");
    }

    /**
     * Get the option from file or load defaults or load from memory.
     */
    getOption(): Option {
        if (this.option == null) {
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
     */
    save(option: Option) {
        writeFileSync(this.file, JSON.stringify(option, null, 2));
    }

    /**
     * Create the options folder.
     */
    createFolder(): string {
        const optionsFolder = join(this.args.output.filename, "options");
        if (!existsSync(optionsFolder)) {
            mkdirSync(optionsFolder);
        }
        return optionsFolder;
    }
}
