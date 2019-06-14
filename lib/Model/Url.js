import uuid from "uuid-with-v6";
/**
 * Url found on the site.
 */

export default class Url {
  /**
   * Kind of like a id for file names and look up.
   */

  /**
   * Full url found on the site.
   */

  /**
   * This is used by the a11y reporter to access logged in sites.
   */
  constructor(url) {
    this.name = uuid.v6();
    this.url = url;
    this.fragment = "";
  }

}
//# sourceMappingURL=Url.js.map