// @flow
import { existsSync, mkdirSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import Database from "better-sqlite3";

import Url from "../Model/Url";

/**
 * Read and write the current crawl state to file.
 */
export default class SqliteCrawlStatesRepository {
  projectFolder: string;
  databaseFile: string;
  db: Database;
  insertUrlsStmt: any;
  insertUrlsAttemptedStmt: any;
  insertUrlsPoolStmt: any;

  constructor(projectFolder: string) {
    this.projectFolder = projectFolder;

    this.createIndexFolder();
    this.db = new Database(this.databaseFile, {});

    this.insertUrlsStmt = this.db.prepare("INSERT INTO urls VALUES (?, ?)");
    this.insertUrlsAttemptedStmt = this.db.prepare(
      "INSERT INTO urls_attempted VALUES (?)"
    );
    this.insertUrlsPoolStmt = this.db.prepare(
      "INSERT INTO urls_pool VALUES (?)"
    );
  }

  /**
   * Truncate and initialize the pool.
   */
  initUrlsPool(urls: string[]) {
    this.db.prepare("DELETE FROM urls_pool").run();
    this.db.prepare("VACUUM").run();
    urls.forEach(url => this.insertUrlsPoolStmt.run([url]));
  }

  /**
   * Get the number of urls in the urls pool.
   */
  urlsPoolSize(): number {
    const result = this.db
      .prepare("SELECT COUNT(*) as size FROM urls_pool")
      .get();
    return result.size;
  }

  /**
   * Get the number of urls found.
   */
  urlsSize(): number {
    return this.db.prepare("SELECT COUNT(*) as size FROM urls").get().size;
  }

  /**
   * Add a url that needs to be crawled.
   */
  addPoolUrl(url: string) {
    if (this.findAttemptedUrls(url) === 0) {
      this.insertUrlsPoolStmt.run([url]);
      this.insertUrlsAttemptedStmt.run([url]);
    }
  }

  /**
   * Add a found url.
   */
  addUrl(url: Url) {
    this.insertUrlsStmt.run([url.name, url.url]);
  }

  /**
   * Find all the urls found during the crawl.
   */
  findAllUrls(): Url[] {
    return this.db.prepare("SELECT * FROM urls").all();
  }

  /**
   * Find the number of attempted urls.
   */
  findAttemptedUrls(url: string): number {
    // Remove protocol and trailing slash to avoid duplicate indexing.
    const checkUrl = url.replace(/(https|http)/i, "");
    const query = `SELECT COUNT(*) as size FROM urls_attempted WHERE url='http${checkUrl}' OR url='https${checkUrl}'`;
    const result = this.db.prepare(query).get();
    return result.size;
  }

  /**
   * Pop a url off the urls pools and return.
   */
  popPoolUrl(): string {
    const url = this.db.prepare("SELECT * FROM urls_pool LIMIT 1").get();
    this.db.prepare("DELETE FROM urls_pool WHERE url = ?").run([url.url]);
    return url.url;
  }

  /**
   * Creates the urls folder in the project if it doesn't exist.
   */
  createIndexFolder() {
    let projectsPathUrls = join(this.projectFolder, "urls");
    if (!existsSync(projectsPathUrls)) {
      mkdirSync(projectsPathUrls);
    }

    this.databaseFile = join(projectsPathUrls, "crawl_state.sqlite");

    if (!existsSync(this.databaseFile)) {
      let tempDbFile = join(
        dirname(__filename),
        "../Assets/crawl_state.sqlite"
      );
      copyFileSync(tempDbFile, this.databaseFile);
    }
  }
}
