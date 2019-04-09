"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _Url=_interopRequireDefault(require("./Url"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Class for reporting the progress.
 */class Progress{/**
     * Build a progress object.
     * @param url {Url} current url
     * @param html {string} for the current url.
     * @param urls {int} urls found.
     * @param urlsPool {int} left to progress through.
     * @param message {string} Message to display.
     */constructor(){let url=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;let html=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;let urls=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;let urlsPool=arguments.length>3&&arguments[3]!==undefined?arguments[3]:0;let message=arguments.length>4&&arguments[4]!==undefined?arguments[4]:null;this.url=url;this.html=html;this.urls=urls;this.urlsPool=urlsPool;this.message=message}/**
     * Build a progress with a message only.
     * @param message {String} to display.
     */static buildWithMessage(message){let progress=new Progress;progress.message=message;return progress}/**
     * Display something meaning full about the progress.
     */toString(){if(this.url!=null){return"".concat(this.urlsPool," | ").concat(this.urls," :: retrieving: ").concat(this.url.url)}return this.message}/**
     * Something to report in the logs.
     */toLog(){return{urlsPoolLength:this.urlsPool,urlsLength:this.urls,url:this.url==null?"":this.url.url}}}exports.default=Progress;
//# sourceMappingURL=Progress.js.map