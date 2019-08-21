// @flow
import UrlParser from "url";
import axios from 'axios';
import path from 'path';

import Progress from "../Model/Progress.js";
import Url from "../Model/Url.js";
import Args from "../Model/Args.js";
import Option from "../Model/Option.js";

import SqliteCrawlStatesRepository from "./SqliteCrawlStatesRepository.js";
import puppeteer from "puppeteer";
import {existsSync, mkdirSync} from "fs";

/**
 * This crawler repository will use a domain name as a data-source and extract urls from it.
 */
export default class CrawlerRepository {
    /**
     * The initial sitemap url.
     */
    initialUrl: string;
    /**
     * Arguments passed to the app from the user.
     */
    args: Args;
    /**
     * Options loaded for the crawl.
     */
    option: Option;
    /**
     * Repository to access the crawl state.
     */
    crawlStatesRepository: SqliteCrawlStatesRepository;
    progress: (Progress) => void;
    resolve: any;
    browser: any;
    page: any;
    screenshotsPath: string;

    /**
     * Build a sitemap repository
     */
    constructor(args: Args, option: Option, projectPath: string) {
        const {initialUrl} = option.index;
        this.initialUrl = initialUrl ? initialUrl : `http://${args.domain}/`;
        this.args = args;
        this.option = option;
        this.screenshotsPath = CrawlerRepository.getScreenshotsPath(projectPath);
    }

    /**
     * Find all the urls on a site.
     */
    async findAllUrls(progress: (Progress) => void): Promise<any> {
        this.progress = progress;
        if (this.crawlStatesRepository.urlsPoolSize() === 0) {
            this.crawlStatesRepository.addPoolUrl(this.initialUrl);
        }
        this.browser = await puppeteer.launch({ignoreHTTPSErrors: true, headless: true});
        this.page = await this.browser.newPage();
        this.page.setJavaScriptEnabled(true);
        if (this.option.credentials) {
            await this.login();
        }
        return new Promise<Url[]>(resolve => {
            this.resolve = resolve;
            this.crawlNextUrl();
        });
    }

    /**
     * Log a user in if needed.
     * @returns {Promise<void>}
     */
    async login() {
        const {loginUrl, usernameSelector, passwordSelector, username, password, buttonSelector} = this.option.credentials;
        await this.page.goto(loginUrl);
        await this.page.waitFor(5000);
        await this.page.$eval(usernameSelector, (node, args) => node.value = args.username, {username: username});
        await this.page.$eval(passwordSelector, (node, args) => node.value = args.password, {password: password});

        const submitElement = await this.page.$(buttonSelector);
        await submitElement.click();
        await this.page.waitFor(5000);
    }

    /**
     * Goto the page and get the html contents of the page.
     * @param url of the page.
     * @returns {Promise<void>}
     */
    async processPage(url: string) {
        await this.page.goto(url, {"waitUntil": "networkidle2"});
        const {waitForRender} = this.option.index;
        if (waitForRender) {
            await this.page.waitFor(waitForRender);
        }
        let response;
        let contentType;
        try {
            response = await axios.get(url);
            contentType = response.headers['content-type'];
        } catch (e) {
        }
        if (!contentType || (contentType && contentType.indexOf("text/html") > -1)) {
            const frame = await this.page.mainFrame();
            const content = await frame.content();
            return {
                headers: response ? response.headers : [],
                html: content
            }
        }
        return null;
    }

    /**
     * Gets the page, if there are more pages it will add them to the list
     * else, just adds the urls to the urls array.
     */
    crawlNextUrl() {
        const urlsPoolSize = this.crawlStatesRepository.urlsPoolSize();
        const urlsSize = this.crawlStatesRepository.urlsSize();
        if (urlsPoolSize === 0 || (urlsSize >= this.args.limit && this.args.limit !== -1)) {
            this.browser.close();
            return this.resolve(this.crawlStatesRepository.findAllUrls());
        }
        let url = CrawlerRepository.cleanUrl(
            this.crawlStatesRepository.popPoolUrl()
        );
        this.processPage(url).then(async data => {
            const newUrl = new Url(url);
            if (newUrl) {
                this.crawlStatesRepository.addUrl(newUrl);
                const urlsSize = this.crawlStatesRepository.urlsSize();
                this.progress(
                    new Progress(newUrl, data.html, data.headers, urlsSize, urlsPoolSize - 1)
                );

                if ((urlsSize <= this.args.screenshots && this.args.screenshots !== -1) || this.args.screenshots === -1) {
                    this.page.screenshot({path: path.join(this.screenshotsPath, `${newUrl.name}.png`)});
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
            } else {
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
    static getScreenshotsPath(projectPath: string) {
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
    isFreshUrl(url: string) {
        const urls = this.crawlStatesRepository.findAttemptedUrls(url);
        return (
            urls === 0 &&
            this.isInDomain(url) &&
            this.isNotExclusion(url) &&
            this.isInclusion(url) &&
            CrawlerRepository.isNotRecursive(url) &&
            CrawlerRepository.isNotDocument(url)
        );
    }

    /**
     * Check to see if the url should be excluded.
     */
    isNotExclusion(url: string): boolean {
        let {path} = UrlParser.parse(url);
        for (let exclusion of this.option.index.exclusions) {
            if (path.startsWith(exclusion)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check to see if the url should be included. If there are no inclusions,
     * then everything is included.
     */
    isInclusion(url: string): boolean {
        const {inclusions} = this.option.index;
        if (!inclusions) {
            return true;
        }
        let {path} = UrlParser.parse(url);
        for (let inclusion of inclusions) {
            if (path.startsWith(inclusion)) {
                return true;
            }
        }
        return false;
    }

    /**
     * This crawler only crawls html pages so make sure it is not something else.
     * The next version will handle every document type.
     */
    static isNotDocument(url: string): boolean {
        return (
            !url.endsWith(".pdf") &&
            !url.endsWith(".jpg") &&
            !url.endsWith(".png") &&
            !url.endsWith(".gif") &&
            !url.endsWith(".xml") && // content-type might be html but we get xml.
            !url.endsWith(".docx") &&
            !url.endsWith(".doc")
        );
    }

    /**
     * Some sites I have crawled urls that are recursive and grow without a 404 being thrown. This
     * method attempts to avoid those pages.
     */
    static isNotRecursive(url: string): boolean {
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
    isInDomain(url: string): boolean {
        return url
            .replace(/(https|http):/i, "")
            .startsWith("//" + this.args.domain);
    }

    /**
     * Remove url params and hashes. They can lead to recursion.
     */
    static cleanUrl(url: string): string {
        return url.split("#")[0];
    }
}
