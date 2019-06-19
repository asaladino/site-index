import winston from 'winston';
import Args from "../Model/Args.js";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
export default class Logger {
  constructor(args) {
    this.args = args;
    this.logsPath = this.getLogsPath();
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: join(this.logsPath, "last_run.log")
      })]
    });
  }

  save(state) {
    return new Promise(resolve => {
      let file = join(this.logsPath, "state.json");
      writeFileSync(file, JSON.stringify(state));
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
    let logsPathBase = join(this.args.getProjectPath(), "logs");

    if (!existsSync(logsPathBase)) {
      mkdirSync(logsPathBase);
    }

    let logsPath = join(this.args.getProjectPath(), "logs", "index");

    if (!existsSync(logsPath)) {
      mkdirSync(logsPath);
    }

    return logsPath;
  }

}
//# sourceMappingURL=Logger.js.map