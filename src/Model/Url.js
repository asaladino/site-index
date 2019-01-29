import uuidv5, { URL } from "uuid/v5";

/**
 * Url found on the site.
 */
export default class Url {
  /**
   * Build a url.
   * @param url {string} found in the sitemap.
   */
  constructor(url) {
    /**
     * Kind of like a id for file names and look up.
     * @type {string}
     */
    this.name = uuidv5(url, URL);
    /**
     * Full url found on the site.
     * @type {string}
     */
    this.url = url;

    // noinspection JSUnusedGlobalSymbols
    /**
     * This is used by the a11y reporter to access logged in sites.
     * @type {string}
     */
    this.fragment = "";
  }
}
