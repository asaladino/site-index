"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _url=_interopRequireDefault(require("url"));var _Progress=_interopRequireDefault(require("../Model/Progress"));var _Url=_interopRequireDefault(require("../Model/Url"));var _Args=_interopRequireDefault(require("../Model/Args"));var _Option=_interopRequireDefault(require("../Model/Option"));var _SqliteCrawlStatesRepository=_interopRequireDefault(require("./SqliteCrawlStatesRepository"));var _puppeteer=_interopRequireDefault(require("puppeteer"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{Promise.resolve(value).then(_next,_throw)}}function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise(function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(undefined)})}}/**
 * This crawler repository will use a domain name as a data-source and extract urls from it.
 */class CrawlerRepository{/**
     * The initial sitemap url.
     */ /**
     * Arguments passed to the app from the user.
     */ /**
     * Options loaded for the crawl.
     */ /**
     * Repository to access the crawl state.
     */ /**
     * Build a sitemap repository
     */constructor(args,option){this.initialUrl="http://".concat(args.domain,"/");this.args=args;this.option=option}/**
     * Find all the urls on a site.
     */findAllUrls(progress){var _this=this;return _asyncToGenerator(function*(){_this.progress=progress;if(_this.crawlStatesRepository.urlsPoolSize()===0){_this.crawlStatesRepository.addPoolUrl(_this.initialUrl)}_this.browser=yield _puppeteer.default.launch();_this.page=yield _this.browser.newPage();_this.page.setJavaScriptEnabled(true);return new Promise(resolve=>{_this.resolve=resolve;_this.crawlNextUrl()})})()}/**
     * Goto the page and get the html contents of the page.
     * @param url of the page.
     * @returns {Promise<void>}
     */processPage(url){var _this2=this;return _asyncToGenerator(function*(){yield _this2.page.goto(url,{"waitUntil":"networkidle2"});yield _this2.page.waitFor(_this2.option.index.waitForRender);return yield _this2.page.mainFrame().content()})()}/**
     * Gets the page, if there are more pages it will add them to the list
     * else, just adds the urls to the urls array.
     */crawlNextUrl(){var _this3=this;const urlsPoolSize=this.crawlStatesRepository.urlsPoolSize();if(urlsPoolSize===0){this.browser.close();return this.resolve(this.crawlStatesRepository.findAllUrls())}let url=CrawlerRepository.cleanUrl(this.crawlStatesRepository.popPoolUrl());this.processPage(url).then(/*#__PURE__*/function(){var _ref=_asyncToGenerator(function*(innerHTML){const newUrl=new _Url.default(url);_this3.crawlStatesRepository.addUrl(newUrl);const urlsSize=_this3.crawlStatesRepository.urlsSize();_this3.progress(new _Progress.default(newUrl,innerHTML,urlsSize,urlsPoolSize-1));if(_this3.args.isSingle()){_this3.resolve(_this3.crawlStatesRepository.findAllUrls())}else{const links=yield _this3.page.$$("a");for(let linkHandle of links){const href=yield _this3.page.evaluate(link=>link.href,linkHandle);let foundUrl=CrawlerRepository.cleanUrl(href);if(_this3.isFreshUrl(foundUrl)){_this3.crawlStatesRepository.addPoolUrl(foundUrl)}}_this3.crawlNextUrl()}});return function(_x){return _ref.apply(this,arguments)}}()).catch(()=>{this.crawlNextUrl()})}/**
     * Has the url been crawled before?
     * @returns {boolean} true if the url has not been attempted.
     */isFreshUrl(url){const urls=this.crawlStatesRepository.findAttemptedUrls(url);return urls===0&&this.isInDomain(url)&&this.isNotExclusion(url)&&CrawlerRepository.isNotRecursive(url)&&CrawlerRepository.isNotDocument(url)}/**
     * Check to see if the url should be excluded.
     */isNotExclusion(url){let path=_url.default.parse(url).urlsParsed;for(let exclusion of this.option.index.exclusions){if(path.startsWith(exclusion)){return false}}return true}/**
     * This crawler only crawls html pages so make sure it is not something else.
     * The next version will handle every document type.
     */static isNotDocument(url){return!url.endsWith(".pdf")&&!url.endsWith(".jpg")&&!url.endsWith(".png")&&!url.endsWith(".gif")&&!url.endsWith(".doc")}/**
     * Some sites I have crawled urls that are recursive and grow without a 404 being thrown. This
     * method attempts to avoid those pages.
     */static isNotRecursive(url){let uri=url.replace(/(https|http):/i,"").split("/");const entries=uri.splice(3,uri.length);for(let entry of entries){const found=entries.filter(e=>e===entry).length;if(found>1){return false}}return true}/**
     * The index will only crawl urls on the given domain.
     */isInDomain(url){return url.replace(/(https|http):/i,"").startsWith("//"+this.args.domain)}/**
     * Remove url params and hashes. They can lead to recursion.
     */static cleanUrl(url){return url.split("?")[0].split("#")[0]}}exports.default=CrawlerRepository;
//# sourceMappingURL=CrawlerRepository.js.map