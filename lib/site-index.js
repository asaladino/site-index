#!/usr/bin/env node
"use strict";

var _commandLineArgs = _interopRequireDefault(require("command-line-args"));

var _commandLineUsage = _interopRequireDefault(require("command-line-usage"));

var _IndexController = _interopRequireDefault(require("./Controller/IndexController.js"));

var _Menu = _interopRequireDefault(require("./Model/Menu.js"));

var _Args = _interopRequireDefault(require("./Model/Args.js"));

var _Main = _interopRequireDefault(require("./Gui/Main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let args = new _Args.default((0, _commandLineArgs.default)(_Menu.default[1]["optionList"]));

if (args.gui) {
  (0, _Main.default)(args);
} else {
  if (args.shouldShowHelp()) {
    console.log((0, _commandLineUsage.default)(_Menu.default));
  } else {
    if (args.verbose) {
      console.log("\nStarting Site Index");
    }

    let indexController = new _IndexController.default(args);
    indexController.start().then();
  }
}
//# sourceMappingURL=site-index.js.map