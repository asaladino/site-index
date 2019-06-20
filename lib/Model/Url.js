"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uuidWithV = _interopRequireDefault(require("uuid-with-v6"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Url found on the site.
 */
class Url {
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
    this.name = _uuidWithV.default.v6();
    this.url = url;
    this.fragment = "";
  }

}

exports.default = Url;
//# sourceMappingURL=Url.js.map