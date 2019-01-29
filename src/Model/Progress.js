import Url from "./Url";

/**
 * Class for reporting the progress.
 */
export default class Progress {
  /**
   * Build a progress object.
   * @param url {Url|null} current url
   * @param html {String|null} for the current url.
   * @param urls {int} urls found.
   * @param urlsPool {int} left to progress through.
   * @param message {String|null} Message to display.
   */
  constructor(url = null, html = null, urls = 0, urlsPool = 0, message = null) {
    this.url = url;
    this.html = html;
    this.urls = urls;
    this.urlsPool = urlsPool;
    this.message = message;
  }

  /**
   * Build a progress with a message only.
   * @param message {String} to display.
   * @returns {Progress} that was built.
   */
  static buildWithMessage(message) {
    let progress = new Progress();
    progress.message = message;
    return progress;
  }

  /**
   * Display something meaning full about the progress.
   * @returns {String}
   */
  toString() {
    if (this.url !== null) {
      return `${this.urlsPool} | ${this.urls} :: retrieving: ${this.url.url}`;
    }
    return this.message;
  }

  /**
   * Something to report in the logs.
   * @return {{urlsPoolLength: number, urlsLength: number, url: string}}
   */
  toLog() {
    return {
      urlsPoolLength: this.urlsPool,
      urlsLength: this.urls,
      url: this.url.url
    };
  }
}
