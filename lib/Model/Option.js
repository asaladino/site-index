"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Options are a way to further customize the site index experience.
 */
class Option {
  /**
   * A list of parts of the site not to crawl.
   */

  /**
   * Info needed to login to a site.
   */
  constructor(option) {
    this.index = {
      exclusions: [],
      inclusions: [],
      waitForRender: 1000,
      initialUrl: null
    };
    Object.assign(this, option);
  }

}

exports.default = Option;
//# sourceMappingURL=Option.js.map