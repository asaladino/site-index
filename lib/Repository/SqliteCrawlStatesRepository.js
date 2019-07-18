"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _path = require("path");

var _betterSqlite = _interopRequireDefault(require("better-sqlite3"));

var _Url = _interopRequireDefault(require("../Model/Url.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Read and write the current crawl state to file.
 */
class SqliteCrawlStatesRepository {
  constructor(projectFolder) {
    this.projectFolder = projectFolder;
    this.createIndexFolder();
    this.db = new _betterSqlite.default(this.databaseFile, {});
    this.insertUrlsStmt = this.db.prepare("INSERT INTO urls VALUES (?, ?, ?, ?)");
    this.insertUrlsAttemptedStmt = this.db.prepare("INSERT INTO urls_attempted VALUES (?)");
    this.insertUrlsPoolStmt = this.db.prepare("INSERT INTO urls_pool VALUES (?)");
  }
  /**
   * Truncate and initialize the pool.
   */


  initUrlsPool(urls) {
    this.db.prepare("DELETE FROM urls_pool").run();
    this.db.prepare("VACUUM").run();
    urls.forEach(url => this.insertUrlsPoolStmt.run([url]));
  }
  /**
   * Get the number of urls in the urls pool.
   */


  urlsPoolSize() {
    const result = this.db.prepare("SELECT COUNT(*) as size FROM urls_pool").get();
    return result.size;
  }
  /**
   * Get the number of urls found.
   */


  urlsSize() {
    return this.db.prepare("SELECT COUNT(*) as size FROM urls").get().size;
  }
  /**
   * Add a url that needs to be crawled.
   */


  addPoolUrl(url) {
    if (this.findAttemptedUrls(url) === 0) {
      this.insertUrlsPoolStmt.run([url]);
      this.insertUrlsAttemptedStmt.run([url]);
    }
  }
  /**
   * Add a found url.
   */


  addUrl(url) {
    this.insertUrlsStmt.run([url.url, url.name, '', '']);
  }
  /**
   * Find all the urls found during the crawl.
   */


  findAllUrls() {
    return this.db.prepare("SELECT * FROM urls").all();
  }
  /**
   * Find the number of attempted urls.
   */


  findAttemptedUrls(url) {
    // Remove protocol and trailing slash to avoid duplicate indexing.
    const checkUrl = url.replace(/(https|http)/i, "");
    const query = "SELECT COUNT(*) as size FROM urls_attempted WHERE url='http".concat(checkUrl, "' OR url='https").concat(checkUrl, "'");
    const result = this.db.prepare(query).get();
    return result.size;
  }
  /**
   * Pop a url off the urls pools and return.
   */


  popPoolUrl() {
    const url = this.db.prepare("SELECT * FROM urls_pool LIMIT 1").get();
    this.db.prepare("DELETE FROM urls_pool WHERE url = ?").run([url.url]);
    return url.url;
  }
  /**
   * Creates the urls folder in the project if it doesn't exist.
   */


  createIndexFolder() {
    let projectsPathUrls = (0, _path.join)(this.projectFolder, "urls");

    if (!(0, _fs.existsSync)(projectsPathUrls)) {
      (0, _fs.mkdirSync)(projectsPathUrls);
    }

    this.databaseFile = (0, _path.join)(projectsPathUrls, "crawl_state.sqlite");

    if (!(0, _fs.existsSync)(this.databaseFile)) {
      let tempDbFile = (0, _path.join)(__dirname, '..', '..', "src", "Assets", "crawl_state.sqlite");
      (0, _fs.copyFileSync)(tempDbFile, this.databaseFile);
    }
  }

}

exports.default = SqliteCrawlStatesRepository;
//# sourceMappingURL=SqliteCrawlStatesRepository.js.map