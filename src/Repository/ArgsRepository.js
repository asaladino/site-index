class ArgsRepository {

    /**
     * Get the environment as a string.
     * @returns {string}
     */
    static getEnvironment() {
        let args = process.argv.slice(2);
        if (args.length > 0) {
            return args[0];
        }
        return '';
    }

}

module.exports = ArgsRepository;