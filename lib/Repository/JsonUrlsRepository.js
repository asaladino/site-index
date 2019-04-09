"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _fs=require("fs");var _Url=_interopRequireDefault(require("../Model/Url"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Save the urls to a json file.
 */class JsonUrlsRepository{/**
     * Build a json url repo.
     */constructor(file){this.file=file}/**
     * Save urls to a json file.
     */save(urls){return new Promise(resolve=>{(0,_fs.writeFileSync)(this.file,JSON.stringify(urls));resolve()})}}exports.default=JsonUrlsRepository;
//# sourceMappingURL=JsonUrlsRepository.js.map