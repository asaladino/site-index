"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FileDetails = _interopRequireDefault(require("./FileDetails"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getFileDetails = filename => {
  return new _FileDetails.default(filename);
};
/**
 * Available options for the site index.
 */


var _default = [{
  header: 'Site Index',
  content: 'Will crawl a site and generate the json file for all the urls found.' + ' Also converts a sitemap to a json file.'
}, {
  header: 'Options',
  optionList: [{
    name: 'domain',
    type: String,
    typeLabel: '[underline]{www.domain.com}',
    description: '(Required) Domain to crawl.'
  }, {
    name: 'output',
    type: getFileDetails,
    typeLabel: '[underline]{file}',
    description: '(Required) Folder to output the information to.'
  }, {
    name: 'uri',
    type: String,
    typeLabel: '[underline]{/path/to/file.html}',
    description: 'You might want to add just one more path to index.'
  }, {
    name: 'html',
    defaultValue: false,
    type: Boolean,
    description: 'Save the raw html to file.'
  }, {
    name: 'type',
    defaultValue: 'crawl',
    type: String,
    typeLabel: '[underline]{sitemap|crawl|single}',
    description: 'Use the sitemap or crawl to index a site for links.'
  }, {
    name: 'verbose',
    defaultValue: false,
    type: Boolean,
    description: 'Output progress information on the index.'
  }, {
    name: 'help',
    type: Boolean,
    description: 'Print this usage guide.'
  }]
}];
exports.default = _default;
//# sourceMappingURL=Menu.js.map