// @flow

type Index = {
    exclusions: string[],
    inclusions: string[],
    waitForRender: number,
    initialUrl: string
};

type Credentials = {
    username: string,
    password: string,
    loginUrl: string,
    usernameSelector: string,
    passwordSelector: string,
    buttonSelector: string
};

/**
 * Options are a way to further customize the site index experience.
 */
export default class Option {
    /**
     * A list of parts of the site not to crawl.
     */
    index: Index;
    /**
     * Info needed to login to a site.
     */
    credentials: Credentials;

    constructor(option: any) {
        this.index = {
            exclusions: [],
            inclusions: [],
            waitForRender: 1000,
            initialUrl: null
        };
        Object.assign(this, option);
    }
}
