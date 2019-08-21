"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _Url = _interopRequireDefault(require("../Model/Url.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _require = require('json2csv'),
      parse = _require.parse;
/**
 * Save the urls to a json file.
 */


class CsvUrlsRepository {
  /**
   * Build a json url repo.
   */
  constructor(file) {
    this.file = file;
  }
  /**
   * Save urls to a json file.
   */


  save(urls) {
    const fields = ['name', 'url', 'fragment'];
    const opts = {
      fields
    };
    return new Promise(resolve => {
      const data = parse(urls, opts);
      (0, _fs.writeFileSync)(this.file, data);
      resolve();
    });
  }

}

exports.default = CsvUrlsRepository;
//# sourceMappingURL=CsvUrlsRepository.js.map