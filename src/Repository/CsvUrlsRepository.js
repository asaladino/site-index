// @flow
import {writeFileSync} from "fs";
import Url from "../Model/Url.js";
const { parse } = require('json2csv');

/**
 * Save the urls to a json file.
 */
export default class CsvUrlsRepository {
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
        const fields = ['name', 'url', 'fragment'];
        const opts = { fields };
        return new Promise(resolve => {
            const data = parse(urls, opts);
            writeFileSync(this.file, data);
            resolve();
        });
    }
}
