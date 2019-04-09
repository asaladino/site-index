// @flow
import Url from "./Url";

type ProgressLog = {
    urlsPoolLength: number,
    urlsLength: number,
    url: string
};

/**
 * Class for reporting the progress.
 */
export default class Progress {
    url: ?Url;
    html: ?string;
    urls: number;
    urlsPool: number;
    message: ?string;

    /**
     * Build a progress object.
     * @param url {Url} current url
     * @param html {string} for the current url.
     * @param urls {int} urls found.
     * @param urlsPool {int} left to progress through.
     * @param message {string} Message to display.
     */
    constructor(
        url: ?Url = null,
        html: ?string = null,
        urls: number = 0,
        urlsPool: number = 0,
        message: ?string = null
    ) {
        this.url = url;
        this.html = html;
        this.urls = urls;
        this.urlsPool = urlsPool;
        this.message = message;
    }

    /**
     * Build a progress with a message only.
     * @param message {String} to display.
     */
    static buildWithMessage(message: string): Progress {
        let progress = new Progress();
        progress.message = message;
        return progress;
    }

    /**
     * Display something meaning full about the progress.
     */
    toString(): ?string {
        if (this.url != null) {
            return `${this.urlsPool} | ${this.urls} :: retrieving: ${this.url.url}`;
        }
        return this.message;
    }

    /**
     * Something to report in the logs.
     */
    toLog(): ProgressLog {
        return {
            urlsPoolLength: this.urlsPool,
            urlsLength: this.urls,
            url: this.url == null ? "" : this.url.url
        };
    }
}
