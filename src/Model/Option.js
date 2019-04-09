// @flow

type Index = {
    exclusions: string[],
    waitForRender: number
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
            exclusions: [],
            waitForRender: 1000
        };
        Object.assign(this, option);
    }
}
