const npminstall = require("npminstall");
const { exec, spawn } = require("child_process");
import { ExceptionUtilities } from "./Utilities";
import constants from "./constants";
import DynamoClient from "./dynamodb";
import IProjectDetails, {
  IExecutionDetails,
  IMachineDetails,
  LogLevel,
} from "./types/projectDetails";
export default class Runner {
  public static async installDependencies() {
    const install= await npminstall({
      // install root dir
      root: constants.projectDir,
      // optional packages need to install, default is package.json's dependencies and devDependencies
      // pkgs: [
      //   { name: 'foo', version: '~1.0.0' },
      // ],
      // install to specific directory, default to root
      // targetDir: '/home/admin/.global/lib',
      // link bin to specific directory (for global install)
      // binDir: '/home/admin/.global/bin',
      // registry, default is https://registry.npmjs.org
      // registry: 'https://registry.npmjs.org',
      // debug: false,
      // storeDir: root + 'node_modules',
      // ignoreScripts: true, // ignore pre/post install scripts, default is `false`
      // forbiddenLicenses: forbit install packages which used these licenses
    });
    console.log({install});
  }

  public static async run(
    project: IProjectDetails,
    execution: IExecutionDetails,
    machine: IMachineDetails
  ) {
    console.log("Running");
    let cancelFunction: () => void = undefined;
    const execPromise = new Promise<void>((resolve, reject) => {
      cancelFunction = reject;
      const cmd = spawn("node",["/jslt-scripts/project/main.js"]);
      cmd.stdout.on("data", async function (data) {
        const message = data.toString();
        console.log("stdout: " +message);
        await DynamoClient.logMachineExecution(
          project,
          execution,
          machine,
          message,
          LogLevel.TRACE
        );
      });

      cmd.stderr.on("data", async function (data) {
        const message = data.toString();
        console.log("stderr: " +message);
        await DynamoClient.logMachineExecution(
          project,
          execution,
          machine,
          message,
          LogLevel.ERROR
        );
      });

      cmd.on("exit", async function (code) {
        cancelFunction = undefined;
        console.log("child process exited with code " + code.toString());
        await DynamoClient.logMachineExecution(
          project,
          execution,
          machine,
          "child process exited with code " + code.toString(),
          LogLevel.TRACE
        );
        resolve();
      });
    });

    const out = setTimeout(() => {
      if (cancelFunction != undefined) {
        cancelFunction();
      }
    }, 30000);
    await execPromise;
    out.unref();
    console.log("Execution finished");
    await DynamoClient.logMachineExecution(
      project,
      execution,
      machine,
      "Execution finished",
      LogLevel.TRACE
    );
  }
}
