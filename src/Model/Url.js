// @flow
import uuidv5, {URL} from "uuid/v5";

/**
 * Url found on the site.
 */
export default class Url {
    /**
     * Kind of like a id for file names and look up.
     */
    name: string;
    /**
     * Full url found on the site.
     */
    url: string;
    /**
     * This is used by the a11y reporter to access logged in sites.
     */
    fragment: string;

    constructor(url: string) {
        this.name = uuidv5(url, URL);
        this.url = url;
        this.fragment = "";
    }
}
