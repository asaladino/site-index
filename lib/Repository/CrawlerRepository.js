import UrlParser from "url";
import axios from 'axios';
import path, { join } from 'path';
import Progress from "../Model/Progress.js";
import Url from "../Model/Url.js";
import Args from "../Model/Args.js";
import Option from "../Model/Option.js";
import SqliteCrawlStatesRepository from "./SqliteCrawlStatesRepository.js";
import puppeteer from "puppeteer";
import { existsSync, mkdirSync } from "fs";
/**
 * This crawler repository will use a domain name as a data-source and extract urls from it.
 */

export default class CrawlerRepository {
  /**
   * The initial sitemap url.
   */

  /**
   * Arguments passed to the app from the user.
   */

  /**
   * Options loaded for the crawl.
   */

  /**
   * Repository to access the crawl state.
   */

  /**
   * Build a sitemap repository
   */
  constructor(args, option, projectPath) {
    this.initialUrl = `http://${args.domain}/`;
    this.args = args;
    this.option = option;
    this.screenshotsPath = this.getScreenshotPath(projectPath);
  }
  /**
   * Find all the urls on a site.
   */


  async findAllUrls(progress) {
    this.progress = progress;

    if (this.crawlStatesRepository.urlsPoolSize() === 0) {
      this.crawlStatesRepository.addPoolUrl(this.initialUrl);
    }

    this.browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true
    });
    this.page = await this.browser.newPage();
    this.page.setJavaScriptEnabled(true);
    return new Promise(resolve => {
      this.resolve = resolve;
      this.crawlNextUrl();
    });
  }
  /**
   * Goto the page and get the html contents of the page.
   * @param url of the page.
   * @returns {Promise<void>}
   */


  async processPage(url) {
    await this.page.goto(url, {
      "waitUntil": "networkidle2"
    });
    const {
      waitForRender
    } = this.option.index;

    if (waitForRender) {
      await this.page.waitFor(waitForRender);
    } // Add check for html doc.


    const response = await axios(url);
    const content = await this.page.mainFrame().content();
    return {
      headers: response.headers,
      html: content
    };
  }
  /**
   * Gets the page, if there are more pages it will add them to the list
   * else, just adds the urls to the urls array.
   */


  crawlNextUrl() {
    const urlsPoolSize = this.crawlStatesRepository.urlsPoolSize();
    const urlsSize = this.crawlStatesRepository.urlsSize();

    if (urlsPoolSize === 0 || urlsSize >= this.args.limit && this.args.limit !== -1) {
      this.browser.close();
      return this.resolve(this.crawlStatesRepository.findAllUrls());
    }

    let url = CrawlerRepository.cleanUrl(this.crawlStatesRepository.popPoolUrl());
    this.processPage(url).then(async data => {
      const newUrl = new Url(url);
      this.crawlStatesRepository.addUrl(newUrl);
      const urlsSize = this.crawlStatesRepository.urlsSize();
      this.progress(new Progress(newUrl, data.html, data.headers, urlsSize, urlsPoolSize - 1));

      if (urlsSize <= this.args.screenshots && this.args.screenshots !== -1 || this.args.screenshots === -1) {
        this.page.screenshot({
          path: path.join(this.screenshotsPath, `${newUrl.name}.png`)
        });
      }

      if (this.args.isSingle()) {
        this.resolve(this.crawlStatesRepository.findAllUrls());
      } else {
        const links = await this.page.$$("a");

        for (let linkHandle of links) {
          const href = await this.page.evaluate(link => link.href, linkHandle);
          let foundUrl = CrawlerRepository.cleanUrl(href);

          if (this.isFreshUrl(foundUrl)) {
            this.crawlStatesRepository.addPoolUrl(foundUrl);
          }
        }

        this.crawlNextUrl();
      }
    }).catch(() => {
      this.crawlNextUrl();
    });
  }
  /**
   * Get the path to the screenshots directory for the project.
   * @param projectPath as a base
   * @returns {string} the screenshots path.
   */


  getScreenshotPath(projectPath) {
    let screenshotsPath = path.join(projectPath, 'screenshots');

    if (!existsSync(screenshotsPath)) {
      mkdirSync(screenshotsPath);
    }

    return screenshotsPath;
  }
  /**
   * Has the url been crawled before?
   * @returns {boolean} true if the url has not been attempted.
   */


  isFreshUrl(url) {
    const urls = this.crawlStatesRepository.findAttemptedUrls(url);
    return urls === 0 && this.isInDomain(url) && this.isNotExclusion(url) && CrawlerRepository.isNotRecursive(url) && CrawlerRepository.isNotDocument(url);
  }
  /**
   * Check to see if the url should be excluded.
   */


  isNotExclusion(url) {
    let {
      path
    } = UrlParser.parse(url);

    for (let exclusion of this.option.index.exclusions) {
      if (path.startsWith(exclusion)) {
        return false;
      }
    }

    return true;
  }
  /**
   * This crawler only crawls html pages so make sure it is not something else.
   * The next version will handle every document type.
   */


  static isNotDocument(url) {
    return !url.endsWith(".pdf") && !url.endsWith(".jpg") && !url.endsWith(".png") && !url.endsWith(".gif") && !url.endsWith(".doc");
  }
  /**
   * Some sites I have crawled urls that are recursive and grow without a 404 being thrown. This
   * method attempts to avoid those pages.
   */


  static isNotRecursive(url) {
    let uri = url.replace(/(https|http):/i, "").split("/");
    const entries = uri.splice(3, uri.length);

    for (let entry of entries) {
      const found = entries.filter(e => e === entry).length;

      if (found > 1) {
        return false;
      }
    }

    return true;
  }
  /**
   * The index will only crawl urls on the given domain.
   */


  isInDomain(url) {
    return url.replace(/(https|http):/i, "").startsWith("//" + this.args.domain);
  }
  /**
   * Remove url params and hashes. They can lead to recursion.
   */


  static cleanUrl(url) {
    return url.split("?")[0].split("#")[0];
  }

}
//# sourceMappingURL=CrawlerRepository.js.map