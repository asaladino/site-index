"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _fs=require("fs");var _Url=_interopRequireDefault(require("../Model/Url"));var _path=require("path");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Save the url html to file.
 */class HeadersRepository{/**
     * Location to the headers folder in the project.
     */ /**
     * Build a json url repo.
     */constructor(projectFolder){this.projectFolder=projectFolder}/**
     * Save html to a file.
     */save(url,headers){const file=(0,_path.join)(this.getProjectsHeadersFolder(),url.name+".json");return new Promise(resolve=>{(0,_fs.writeFileSync)(file,JSON.stringify(headers));resolve()})}/**
     * Creates the html folder in the project if it doesn't exist.
     */getProjectsHeadersFolder(){let projectsPathHeaders=(0,_path.join)(this.projectFolder,"headers");if(!(0,_fs.existsSync)(projectsPathHeaders)){(0,_fs.mkdirSync)(projectsPathHeaders)}return projectsPathHeaders}}exports.default=HeadersRepository;
//# sourceMappingURL=HeadersRepository.js.map