# Site Index

Site Index crawl a site and index any reachable urls and output to a urls.json file.

To start a crawl, run the `index.js` file

```
./site-index --domain "codingsimply.com" --verbose --html --type crawl --output "/some/reports"
```

Domain and output folder are required parameters. To see a list of parameters, run

```
node index.js --help

Sitemap Dump

  Converts a sitemap to a json format for report generation. Will also crawl a  
  site to generate the json file.                                               

Options

  --domain www.domain.com   (Required) Domain to crawl.                     
  --output file             (Required) Folder to output the information to. 
  --type sitemap|crawl      Use the sitemap or crawl the site for links.    
  --verbose                 Output information on the crawl.                
  --help                    Print this usage guide.    

```