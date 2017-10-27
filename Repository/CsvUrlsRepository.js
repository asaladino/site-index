let fs = require('fs');

/**
 * Save some urls to a csv file.
 */
class CsvUrlsRepository {

    /**
     * Location of the csv file.
     * @param file {string}
     */
    constructor(file) {
        this.file = file;
    }

    /**
     * Save urls to a csv file.
     * @param urls {[Url]}
     * @returns {Promise}
     */
    save(urls) {
        return new Promise((resolve, reject) => {
            fs.writeFileSync(this.file, '', function (error) {
                reject(error);
            });
            urls.forEach(url => {
                fs.appendFile(this.file, url.url + "\n", function (error) {
                    if (error) {
                        reject(error);
                    }
                });
            });
            resolve();
        });
    }

}

module.exports = CsvUrlsRepository;