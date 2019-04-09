"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _FileDetails=_interopRequireDefault(require("./FileDetails"));var _path=require("path");var _fs=require("fs");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Command-line arguments being passed to the indexer.
 */class Args{/**
     * Project directory to output the index results.
     */ /**
     * What type of indexing is taking place: crawl or sitemap?
     */ /**
     * Should the html be saved?
     */ /**
     * Domain being indexed.
     */ /**
     * URI of a single path you want to add to the index.
     */ /**
     * Should progress information be output to the console?
     */constructor(params){this.type="crawl";this.verbose=true;Object.assign(this,params)}/**
     * If the mandatory options are not passed then show the menu.
     * @returns {boolean} true if the mandatory options are not passed.
     */shouldShowHelp(){return this.hasOwnProperty("help")||this.domain==null||this.output==null}/**
     * Is the indexing going to be a crawl?
     * @returns {boolean} true if it is.
     */isCrawl(){return this.type==="crawl"}/**
     * Adds a single page to the index.
     * @return {boolean}
     */isSingle(){return this.type==="single"}/**
     * Get the url for a single page crawl.
     * @return {string} url.
     */getSingleUrl(){if(this.uri!=null){return"https://".concat(this.domain).concat(this.uri)}}/**
     * Name of the site that is being crawled.
     * @returns {string}
     */getSiteName(){return this.domain.replace(/[.]/g,"_")}/**
     * Get the project folder which the output + the site name. Also, it will be created if it doesn't exist.
     * @returns {string} the project path.
     */getProjectPath(){let siteName=this.getSiteName();let projectPath=(0,_path.join)(this.output.filename,siteName);if(!(0,_fs.existsSync)(projectPath)){(0,_fs.mkdirSync)(projectPath)}return projectPath}}exports.default=Args;
//# sourceMappingURL=Args.js.map