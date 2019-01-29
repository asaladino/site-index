/**
 * Options are a way to further customize the site index experience.
 */
export default class Option {
  constructor(option) {
    /**
     * A list of parts of the site not to crawl.
     * @type {*}
     */
    this.index = {
      /**
       * @type {[String]}
       */
      exclusions: []
    };
    Object.assign(this, option);
  }
}
