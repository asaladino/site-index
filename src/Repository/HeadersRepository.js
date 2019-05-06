// @flow
import {writeFileSync, existsSync, mkdirSync} from "fs";
import Url from "../Model/Url";
import {join} from "path";

/**
 * Save the url html to file.
 */
export default class HeadersRepository {
    /**
     * Location to the headers folder in the project.
     */
    projectFolder: string;

    /**
     * Build a json url repo.
     */
    constructor(projectFolder: string) {
        this.projectFolder = projectFolder;
    }

    /**
     * Save html to a file.
     */
    save(url: Url, headers: any): Promise<any> {
        const file = join(this.getProjectsHeadersFolder(), url.name + ".json");
        return new Promise(resolve => {
            writeFileSync(file, JSON.stringify(headers));
            resolve();
        });
    }

    /**
     * Creates the html folder in the project if it doesn't exist.
     */
    getProjectsHeadersFolder(): string {
        let projectsPathHeaders = join(this.projectFolder, "headers");
        if (!existsSync(projectsPathHeaders)) {
            mkdirSync(projectsPathHeaders);
        }
        return projectsPathHeaders;
    }
}
