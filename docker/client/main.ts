import * as fs from 'fs';
import DynamoClient from "./dynamodb";
import S3 from "./s3";
import IProjectDetails from "./types/projectDetails";
import Runner from "./runner";
export class MainEntryPoint {
  public machineGuid: string;
  public projectGuid: string;
  public AccessKeyId: string;
  public SecretAccessKey: string;
  public projectConfig:IProjectDetails

  public async setup() {
    console.log("args: >>", process.argv);
    this.machineGuid = process.argv[2]
    this.projectGuid = process.argv[3]
    this.setCredentials();
    await this.getDynamoConfig();
    await this.DowloadS3Project();
  }

  public async DowloadS3Project() {
    await S3.getProjectPackage(this.projectConfig);
  }

  public async getDynamoConfig() {
   this.projectConfig= await DynamoClient.getProjectDetails(this.projectGuid);
  }

  public getMachineGuid(): string {
    return fs.readFileSync("/jslt-scripts/client/machineGuid", "utf8");
  }
  public getprojectGuid(): string {
    return fs.readFileSync("/jslt-scripts/client/projectGuid", "utf8");
  }

  public setCredentials() {
    this.AccessKeyId = process.argv[4]
    this.SecretAccessKey = process.argv[5]
    const credentialsFile = "~/.aws/credentials";
    fs.writeFileSync(
      credentialsFile,
      "[default]\naws_access_key_id = " +
      this.AccessKeyId +
        "\naws_secret_access_key = " +
        this.SecretAccessKey +
        "\n"
    );
  }
}
const main = new MainEntryPoint();
main.setup()
.then(() => {
    console.log("Setup complete");
    Runner.run();
})