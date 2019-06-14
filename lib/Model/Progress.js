import Url from "./Url.js";

/**
 * Class for reporting the progress.
 */
export default class Progress {
  /**
   * Build a progress object.
   * @param url {Url} current url
   * @param html {string} for the current url.
   * @param headers {any} for the current url.
   * @param urls {int} urls found.
   * @param urlsPool {int} left to progress through.
   * @param message {string} Message to display.
   */
  constructor(url = null, html = null, headers = null, urls = 0, urlsPool = 0, message = null) {
    this.url = url;
    this.html = html;
    this.headers = headers;
    this.urls = urls;
    this.urlsPool = urlsPool;
    this.message = message;
  }
  /**
   * Build a progress with a message only.
   * @param message {String} to display.
   */


  static buildWithMessage(message) {
    let progress = new Progress();
    progress.message = message;
    return progress;
  }
  /**
   * Display something meaning full about the progress.
   */


  toString() {
    if (this.url != null) {
      return `${this.urlsPool} | ${this.urls} :: retrieving: ${this.url.url}`;
    }

    return this.message;
  }
  /**
   * Something to report in the logs.
   */


  toLog() {
    return {
      urlsPoolLength: this.urlsPool,
      urlsLength: this.urls,
      url: this.url == null ? "" : this.url.url
    };
  }

}
//# sourceMappingURL=Progress.js.map