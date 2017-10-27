let fs = require('fs');

/**
 * Save the urls to a json file.
 */
class JsonUrlsRepository {

    /**
     * Build a json url repo.
     * @param file
     */
    constructor(file) {
        this.file = file;
    }

    /**
     * Save urls to a json file.
     * @param urls {[Url]}
     * @returns {Promise}
     */
    save(urls) {
        return new Promise((resolve, reject) => {
            fs.writeFileSync(this.file, JSON.stringify(urls), function (error) {
                reject(error);
            });
            resolve();
        });
    }

}

module.exports = JsonUrlsRepository;