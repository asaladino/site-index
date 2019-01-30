"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _Url = _interopRequireDefault(require("../Model/Url"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Save the url html to file.
 */
class HtmlRepository {
  /**
   * Location to the html folder in the project.
   */

  /**
   * Build a json url repo.
   */
  constructor(projectFolder) {
    this.projectFolder = projectFolder;
  }
  /**
   * Save html to a file.
   */


  save(url, html) {
    const file = (0, _path.join)(this.getProjectsHtmlFolder(), url.name + ".html");
    return new Promise(resolve => {
      (0, _fs.writeFileSync)(file, html);
      resolve();
    });
  }
  /**
   * Creates the html folder in the project if it doesn't exist.
   */


  getProjectsHtmlFolder() {
    let projectsPathHtml = (0, _path.join)(this.projectFolder, "html");

    if (!(0, _fs.existsSync)(projectsPathHtml)) {
      (0, _fs.mkdirSync)(projectsPathHtml);
    }

    return projectsPathHtml;
  }

}

exports.default = HtmlRepository;
//# sourceMappingURL=HtmlRepository.js.map