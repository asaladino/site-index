"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _Service=_interopRequireDefault(require("./Service"));var _SitemapRepository=_interopRequireDefault(require("../Repository/SitemapRepository"));var _JsonUrlsRepository=_interopRequireDefault(require("../Repository/JsonUrlsRepository"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * This service will extract all the urls from a sitemap or nested sitemaps.
 */class SitemapService extends _Service.default{/**
     * Start the sitemap service to extract the domain urls from the sitemap.
     * Assumes the sitemap is located at the domain + /sitemap.xml
     */start(){let urlsRepository=new _JsonUrlsRepository.default(this.getPathJsonUrlsFile());let sitemapRepository=new _SitemapRepository.default("http://"+this.args.domain+"/sitemap.xml");sitemapRepository.findAllPages(progress=>this.emitProgress(progress)).then(urls=>{urlsRepository.save(urls).then(()=>this.emitComplete())})}}exports.default=SitemapService;
//# sourceMappingURL=SitemapService.js.map