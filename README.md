# Sitemap Dump

Dumps a nested sitemap to csv.

Update the url for the initial sitemap,

```js
let SitemapRepository = require('./Repository/SitemapRepository');
let sitemapRepository = new SitemapRepository('https://www.sitename.com/sitemap.xml');
```

select the output repo,
```js
let JsonUrlsRepository = require('./Repository/JsonUrlsRepository');
urlsRepository = new JsonUrlsRepository('output/urls.json');

let CsvUrlsRepository = require('./Repository/CsvUrlsRepository');
urlsRepository = new CsvUrlsRepository('output/urls.csv');
```

then run the `index.js` file

```
node index.js
```
