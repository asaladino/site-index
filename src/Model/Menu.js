// @flow
import FileDetails from './FileDetails.js';

const getFileDetails = (filename: string): FileDetails => {
    return new FileDetails(filename);
};

/**
 * Available options for the site index.
 */
export default [
    {
        header: 'Site Index',
        content: 'Will crawl a site and generate the json file for all the urls found.' +
            ' Also converts a sitemap to a json file.'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'domain',
                type: String,
                typeLabel: '[underline]{www.domain.com}',
                description: '(Required) Domain to crawl.'
            },
            {
                name: 'output',
                type: getFileDetails,
                typeLabel: '[underline]{file}',
                description: '(Required) Folder to output the information to.'
            },
            {
                name: 'uri',
                type: String,
                typeLabel: '[underline]{/path/to/file.html}',
                description: 'You might want to add just one more path to index.'
            },
            {
                name: 'html',
                defaultValue: false,
                type: Boolean,
                description: 'Save the raw html to file.'
            },
            {
                name: 'gui',
                defaultValue: false,
                type: Boolean,
                description: 'Show the gui.'
            },
            {
                name: 'headers',
                defaultValue: false,
                type: Boolean,
                description: 'Save the response headers to file.'
            },
            {
                name: 'limit',
                defaultValue: 500,
                type: Number,
                description: 'Max number of urls to scan. Default is 500, a value of -1 scans without limit.'
            },
            {
                name: 'screenshots',
                defaultValue: 1,
                type: Number,
                description: 'Max number of screenshots to take. Default is 1, a value of -1 screenshots every page.'
            },
            {
                name: 'type',
                defaultValue: 'crawl',
                type: String,
                typeLabel: '[underline]{crawl|single}',
                description: 'Do you want to crawl the whole site or just one page?'
            },
            {
                name: 'seedWithSitemap',
                defaultValue: false,
                type: Boolean,
                description: 'Should the crawl start off with seeding from the sitemap?'
            },
            {
                name: 'verbose',
                defaultValue: false,
                type: Boolean,
                description: 'Output progress information on the index.'
            },
            {
                name: 'help',
                type: Boolean,
                description: 'Print this usage guide.'
            }
        ]
    }
];