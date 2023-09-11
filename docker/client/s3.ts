import AWS = require("aws-sdk");
import IProjectDetails from "./types/projectDetails";
import * as fs from "fs";
import * as decompress from "decompress";
export default class S3 {
  public static async getFile(
    bucket: string,
    key: string,
    path: string
  ): Promise<void> {
    const s3 = new AWS.S3();
    const s3Params = {
      Bucket: bucket,
      Key: key,
    };
    await new Promise<void>((resolve, reject) => {
      s3.getObject(s3Params, function (err, res) {
        if (err === null) {
          fs.writeFileSync(path, res.Body as Buffer);
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  public static async getProjectPackage(projectConfig: IProjectDetails) {
    const output = "/jslt-scripts/project";
    const path = "/jslt-scripts/project/main.zip";
    if (fs.existsSync(path) == false) {
      fs.mkdirSync("/jslt-scripts/project", { recursive: true });
    }
    await this.getFile(
      projectConfig.S3_BUCKET,
      projectConfig.S3_PROJECT_ZIP,
      path
    );

    const files = await decompress(path, output,{ });
    console.log({projectFiles: files.map(f=>f.path)});
    console.log("Project downloaded");
  }
}
