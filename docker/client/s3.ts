import AWS = require('aws-sdk'); 
import IProjectDetails from "./types/projectDetails";
import * as fs from 'fs';
import unzipper from "unzipper";
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
          fs.writeFileSync(path,res.Body as Buffer);
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  public static async getProjectPackage(projectConfig: IProjectDetails) {
    const path = "/jslt-scripts/project/main.zip";
    await this.getFile(
      projectConfig.S3_BUCKET,
      projectConfig.S3_PROJECT_ZIP,
      path
    );
    await fs
      .createReadStream(path)
      .pipe(unzipper.Parse())
      .on("entry", (entry) => entry.autodrain())
      .promise()
      .then(
        () => console.log("done"),
        (e) => console.log("error", e)
      );
  }
}
