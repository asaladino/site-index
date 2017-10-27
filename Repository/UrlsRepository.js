let fs = require('fs');

class UrlsRepository {

    constructor(file) {
        this.file = file;
    }

    save(urls) {
        return new Promise((resolve, reject) => {
            fs.writeFileSync(this.file, '', function (error) {
                reject(error);
            });
            urls.forEach(url => {
                fs.appendFile(this.file, url + "\n", function (error) {
                    if (error) {
                        reject(error);
                    }
                });
            });
            resolve();
        });
    }

}

module.exports = UrlsRepository