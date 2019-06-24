// @flow
import FileDetails from "./FileDetails.js";
import {join} from "path";
import {existsSync, mkdirSync} from "fs";

/**
 * Command-line arguments being passed to the indexer.
 */
export default class Args {
    /**
     * Project directory to output the index results.
     */
    output: FileDetails;
    /**
     * What type of indexing is taking place: crawl or single?
     */
    type: string;
    /**
     * Should the crawl start off with seeding from the sitemap?
     */
    seedWithSitemap: boolean;
    /**
     * Should the html be saved?
     */
    html: boolean;
    /**
     * Should the headers be saved?
     */
    headers: boolean;
    /**
     * Domain being indexed.
     */
    domain: string;
    /**
     * URI of a single path you want to add to the index.
     */
    uri: ?string;
    /**
     * Should progress information be output to the console?
     */
    verbose: ?boolean;
    /**
     * Max number of urls to crawl.
     */
    limit: number;
    /**
     * Max number of screenshots to create.
     */
    screenshots: number;

    constructor(params: any) {
        this.type = "crawl";
        this.verbose = true;
        Object.assign(this, params);
    }

    /**
     * If the mandatory options are not passed then show the menu.
     * @returns {boolean} true if the mandatory options are not passed.
     */
    shouldShowHelp(): boolean {
        return (
            this.hasOwnProperty("help") ||
            (this.domain == null || this.output == null)
        );
    }

    /**
     * Adds a single page to the index.
     * @return {boolean}
     */
    isSingle(): boolean {
        return this.type === "single";
    }

    /**
     * Seed the crawl with the sitemap?
     */
    isSeedWithSitemap(): boolean {
        return this.seedWithSitemap;
    }

    /**
     * Get the url for a single page crawl.
     * @return {string} url.
     */
    getSingleUrl(): ?string {
        if (this.uri != null) {
            return `https://${this.domain}${this.uri}`;
        }
    }

    /**
     * Name of the site that is being crawled.
     * @returns {string}
     */
    getSiteName(): string {
        return this.domain.replace(/[.]/g, "_");
    }

    /**
     * Get the project folder which the output + the site name. Also, it will be created if it doesn't exist.
     * @returns {string} the project path.
     */
    getProjectPath(): string {
        let siteName = this.getSiteName();
        let projectPath = join(this.output.filename, siteName);
        if (!existsSync(projectPath)) {
            mkdirSync(projectPath);
        }
        return projectPath;
    }
}
