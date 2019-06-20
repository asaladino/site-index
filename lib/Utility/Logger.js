"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _Args = _interopRequireDefault(require("../Model/Args.js"));

var _path = require("path");

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Logger {
  constructor(args) {
    this.args = args;
    this.logsPath = this.getLogsPath();
    this.logger = _winston.default.createLogger({
      level: "info",
      format: _winston.default.format.json(),
      transports: [new _winston.default.transports.File({
        filename: (0, _path.join)(this.logsPath, "last_run.log")
      })]
    });
  }

  save(state) {
    return new Promise(resolve => {
      let file = (0, _path.join)(this.logsPath, "state.json");
      (0, _fs.writeFileSync)(file, JSON.stringify(state));
      resolve();
    });
  }

  info(state) {
    this.logger.log("info", JSON.stringify(state));
  }

  report(state) {
    this.save(state);
    this.info(state);
  }

  getLogsPath() {
    let logsPathBase = (0, _path.join)(this.args.getProjectPath(), "logs");

    if (!(0, _fs.existsSync)(logsPathBase)) {
      (0, _fs.mkdirSync)(logsPathBase);
    }

    let logsPath = (0, _path.join)(this.args.getProjectPath(), "logs", "index");

    if (!(0, _fs.existsSync)(logsPath)) {
      (0, _fs.mkdirSync)(logsPath);
    }

    return logsPath;
  }

}

exports.default = Logger;
//# sourceMappingURL=Logger.js.map