# Site Index

Site Index will crawl a domain and index any reachable html urls then output to a urls.json file.

## Index a Site

To start an index, run the `node bin\site-index` file

```
./site-index --domain "codingsimply.com" --verbose --headers --html --type crawl --output "/some/reports"
```

Domain and output folder are required parameters. To see a list of parameters, run

```
./bin/site-index --help

Site Index

  Will crawl a site and generate the json file for all the urls found. Also     
  converts a sitemap to a json file.                                            

Options

  --domain www.domain.com       (Required) Domain to crawl.                         
  --output file                 (Required) Folder to output the information to.     
  --uri /path/to/file.html      You might want to add just one more path to index.  
  --html                        Save the raw html to file.                          
  --headers                     Save the response headers to file.                  
  --type sitemap|crawl|single   Use the sitemap or crawl to index a site for links. 
  --verbose                     Output progress information on the index.           
  --help                        Print this usage guide.
```