"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireWildcard(require("uuid/v5"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
    this.name = (0, _v.default)(url, _v.URL);
    this.url = url;
    this.fragment = "";
  }

}

exports.default = Url;
//# sourceMappingURL=Url.js.map