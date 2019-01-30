"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

var _Option = _interopRequireDefault(require("../Model/Option"));

var _OptionDefaults = _interopRequireDefault(require("../Assets/OptionDefaults.json"));

var _Args = _interopRequireDefault(require("../Model/Args"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Save and load options for the index.
 */
class OptionsRepository {
  /**
   * Passed in from the command-line.
   */

  /**
   * Folder where the options are saved.
   */

  /**
   * Path to the options file.
   */

  /**
   * Options for the site indexing.
   */
  constructor(args) {
    this.args = args;
    this.folder = this.createFolder();
    this.file = (0, _path.join)(this.folder, this.args.getSiteName() + ".json");
  }
  /**
   * Get the option from file or load defaults or load from memory.
   */


  getOption() {
    if (this.option == null) {
      if ((0, _fs.existsSync)(this.file)) {
        this.option = new _Option.default(JSON.parse((0, _fs.readFileSync)(this.file).toString()));
      } else {
        this.option = new _Option.default(_OptionDefaults.default);
        this.save(this.option);
      }
    }

    return this.option;
  }
  /**
   * Save the option to file.
   */


  save(option) {
    (0, _fs.writeFileSync)(this.file, JSON.stringify(option, null, 2));
  }
  /**
   * Create the options folder.
   */


  createFolder() {
    const optionsFolder = (0, _path.join)(this.args.output.filename, "options");

    if (!(0, _fs.existsSync)(optionsFolder)) {
      (0, _fs.mkdirSync)(optionsFolder);
    }

    return optionsFolder;
  }

}

exports.default = OptionsRepository;
//# sourceMappingURL=OptionsRepository.js.map