#!/usr/bin/env node
import commandLineArgs from "command-line-args";
import getUsage from "command-line-usage";

import IndexController from "./Controller/IndexController.js";
import menu from "./Model/Menu.js";
import Args from "./Model/Args.js";
import startGui from "./Gui/Main";

let args = new Args(commandLineArgs(menu[1]["optionList"]));

if(args.gui) {
    startGui(args);
} else {
    if (args.shouldShowHelp()) {
        console.log(getUsage(menu));
    } else {
        if (args.verbose) {
            console.log("\nStarting Site Index");
        }
        let indexController = new IndexController(args);
        indexController.start().then();
    }
}
