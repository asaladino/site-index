const FileDetails = require('./FileDetails');

module.exports = [
    {
        header: 'Sitemap Dump',
        content: 'Converts a sitemap to a json format for report generation. Will also crawl a site to generate the json file.'
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
                type: filename => new FileDetails(filename),
                typeLabel: '[underline]{file}',
                description: '(Required) Folder to output the information to.'
            },
            {
                name: 'type',
                defaultValue: 'crawl',
                type: String,
                typeLabel: '[underline]{sitemap|crawl}',
                description: 'Use the sitemap or crawl the site for links.'
            },
            {
                name: 'verbose',
                defaultValue: false,
                type: Boolean,
                description: 'Output information on the crawl.'
            },
            {
                name: 'help',
                type: Boolean,
                description: 'Print this usage guide.'
            }
        ]
    }
];