import * as fs from "fs";
import AWS = require("aws-sdk");
import DynamoClient from "./dynamodb";
import S3 from "./s3";
import IProjectDetails, {
  ExecutionStatus,
  IExecutionDetails,
  IMachineDetails,
  MachineStatus,
} from "./types/projectDetails";
import Runner from "./runner";
import { resolve } from "path";
export const AWSConfig = {
  accessKeyId: process.argv[5],
  secretAccessKey: process.argv[6],
  region: "us-east-1", // Set the region
};
export class MainEntryPoint {
  public AccessKeyId: string;
  public SecretAccessKey: string;
  public projectConfig: IProjectDetails;
  public machineConfig: IMachineDetails;
  public executionConfig: IExecutionDetails | undefined;

  public async setup() {
    console.log("args: >>", process.argv);
    const machineGuid = process.argv[2];
    const projectGuid = process.argv[3];
    const executionGuid = process.argv[4];
    this.setCredentials();
    await this.getDynamoConfig(projectGuid, executionGuid, machineGuid);
    await this.DowloadS3Project();
    await Runner.installDependencies();
    await this.reportStatus(MachineStatus.READY_TO_START);
    await this.waitForStart();
  }

  public async waitForStart(): Promise<void> {
    while (true) {
      await new Promise<void>(async (resolve, reject) => {
        const status = await DynamoClient.getExecutionStatus(
          this.projectConfig.PartitionKey,
          this.executionConfig
        );
        switch (status) {
          case ExecutionStatus.READY_TO_START:
            await this.reportStatus(MachineStatus.RUNNING);
            await Runner.run(this.projectConfig, this.executionConfig, this.machineConfig);
            return;
          case ExecutionStatus.FINISHED:
          case ExecutionStatus.ERROR:
          case ExecutionStatus.CANCELED:
            await this.shutdown();
            return;
        }
        resolve();
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  public async shutdown() {
    await this.reportStatus(MachineStatus.OFF);
    process.exit(0);
  }

  public async DowloadS3Project() {
    await S3.getProjectPackage(this.projectConfig);
  }

  public async getDynamoConfig(
    projectGuid: string,
    executionGuid: string,
    machineGuid: string
  ) {
    this.projectConfig = await DynamoClient.getProjectDetails(projectGuid);
    if (this.projectConfig == undefined) {
      throw new Error("Project not found");
    }
    this.executionConfig = this.projectConfig.Executions?.find(
      (e) => e.Id == executionGuid
    ) as IExecutionDetails;
    if (this.executionConfig == undefined) {
      throw new Error("Execution not found");
    }
    this.machineConfig = this.executionConfig.Machines?.find(
      (m) => m.Id == machineGuid
    ) as IMachineDetails;
    if (this.machineConfig == undefined) {
      throw new Error("Machine not found");
    }
  }

  public getMachineGuid(): string {
    return fs.readFileSync("/jslt-scripts/client/machineGuid", "utf8");
  }
  public getprojectGuid(): string {
    return fs.readFileSync("/jslt-scripts/client/projectGuid", "utf8");
  }

  public setCredentials() {
    this.AccessKeyId = process.argv[4];
    this.SecretAccessKey = process.argv[5];
    AWS.config.update(AWSConfig);
    const credentialsFile = "./credentials";
    fs.writeFileSync(
      credentialsFile,
      "[default]\naws_access_key_id = " +
        this.AccessKeyId +
        "\naws_secret_access_key = " +
        this.SecretAccessKey +
        "\n"
    );
  }

  public async reportStatus(status: MachineStatus, message?: string) {
    await DynamoClient.reportStatus(
      this.projectConfig,
      this.machineConfig,
      this.executionConfig,
      status,
      message
    );
  }
}
const main = new MainEntryPoint();
main.setup().then(() => {
  console.log("Done");
});
