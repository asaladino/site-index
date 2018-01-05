# Site Index

Site Index will crawl a domain and index any reachable html urls then output to a urls.json file.

To start an index, run the `site-index` file

```
./site-index --domain "codingsimply.com" --verbose --html --type crawl --output "/some/reports"
```

Domain and output folder are required parameters. To see a list of parameters, run

```
./site-index --help

Site Index

  Will crawl a site and generate the json file for all the urls found. Also     
  converts a sitemap to a json file.                                            

Options

  --domain www.domain.com   (Required) Domain to crawl.                     
  --output file             (Required) Folder to output the information to. 
  --html                    Save the raw html to file.                      
  --type sitemap|crawl      Use the sitemap or crawl the site for links.    
  --verbose                 Output progress information on the index.       
  --help                    Print this usage guide.  

```