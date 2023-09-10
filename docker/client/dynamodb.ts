import AWS = require('aws-sdk'); 
import IProjectDetails, { ProjectType } from "./types/projectDetails";
export default class DynamoClient {
  public static async getProjectDetails(projectId: string): Promise<IProjectDetails> {
    // Set the region
    //AWS.config.update({region: 'REGION'});
    console.log("projectId: " + projectId);
    const ddb = new AWS.DynamoDB();
    const params = {
      ExpressionAttributeValues: {
        ":p": { S: projectId },
        ":t": { S: ProjectType.PROJECT },
      },
      KeyConditionExpression: "PartitionKey = :p and Type > :t",
      TableName: "jslts",
    };

    return await new Promise<IProjectDetails>((resolve, reject) => {
      ddb.query(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
          return;
        }
        if (data == undefined || data.Items == undefined) {
          reject("No data found");
          return;
        }
        console.log("Success", data.Items);
        resolve({
          PartitionKey: data.Items[0].PartitionKey.S??'',
          // AWS_ACCESS_KEY: data.Items[0].AWS_ACCESS_KEY.S??'',
          // AWS_REGION: data.Items[0].AWS_REGION.S??'',
          // AWS_SECRET_ACCESS_KEY: data.Items[0].AWS_SECRET_ACCESS_KEY.S??'',
          S3_BUCKET: data.Items[0].S3_BUCKET.S??'',
          S3_PROJECT_ZIP: data.Items[0].S3_PROJECT_ZIP.S??'',
          Type: data.Items[0].Type.S as ProjectType,
        });
      });
    });
  }
}
