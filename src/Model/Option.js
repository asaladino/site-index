// @flow

type Index = {
  exclusions: string[]
};

/**
 * Options are a way to further customize the site index experience.
 */
export default class Option {
  /**
   * A list of parts of the site not to crawl.
   */
  index: Index;

  constructor(option: any) {
    this.index = {
      exclusions: []
    };
    Object.assign(this, option);
  }
}
