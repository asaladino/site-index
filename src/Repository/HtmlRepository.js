// @flow
import {writeFileSync, existsSync, mkdirSync} from "fs";
import Url from "../Model/Url";
import {join} from "path";

/**
 * Save the url html to file.
 */
export default class HtmlRepository {
    /**
     * Location to the html folder in the project.
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
    save(url: Url, html: string): Promise<any> {
        const file = join(this.getProjectsHtmlFolder(), url.name + ".html");
        return new Promise(resolve => {
            writeFileSync(file, html);
            resolve();
        });
    }

    /**
     * Creates the html folder in the project if it doesn't exist.
     */
    getProjectsHtmlFolder(): string {
        let projectsPathHtml = join(this.projectFolder, "html");
        if (!existsSync(projectsPathHtml)) {
            mkdirSync(projectsPathHtml);
        }
        return projectsPathHtml;
    }
}
