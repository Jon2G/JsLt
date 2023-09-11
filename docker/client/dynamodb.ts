import AWS = require("aws-sdk");
import IProjectDetails, {
  ExecutionStatus,
  IExecutionDetails,
  IMachineDetails,
  LogLevel,
  MachineStatus,
  ProjectType,
} from "./types/projectDetails";
import { AttributeMap, ItemList } from "aws-sdk/clients/dynamodb";
export default class DynamoClient {
  public static async reportStatus(
    project: IProjectDetails,
    machineConfig: IMachineDetails,
    execution: IExecutionDetails,
    status: MachineStatus,
    message?: string
  ): Promise<void> {
    console.log(
      "machineGuid: " +
        machineConfig.Id +
        " status: " +
        status +
        " message: " +
        message
    );

    const params: AWS.DynamoDB.Types.UpdateItemInput = {
      UpdateExpression:
        "set Executions[" +
        execution.index +
        "].Machines[" +
        machineConfig.index +
        "].",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      TableName: "projects",
      Key: {
        PartitionKey: { S: project.PartitionKey },
      },
    };
    const updateObj: Partial<IMachineDetails> = {
      MachineStatus: status,
      Message: message ?? "",
    };

    for (const [key, value] of Object.entries(updateObj)) {
      params.UpdateExpression += ` #${key} = :${key},`;
      params.ExpressionAttributeNames[`#${key}`] = key;
      const type = typeof value;
      const AttrValue = {};
      switch (type) {
        case "string":
          AttrValue["S"] = value as string;
          break;
        case "number":
          AttrValue["N"] = value as number;
          break;
        case "boolean":
          AttrValue["BOOL"] = value as unknown as boolean;
          break;
        default:
          throw new Error("Unsupported type: " + type);
      }
      params.ExpressionAttributeValues[`:${key}`] = AttrValue;
    }
    params.UpdateExpression = params.UpdateExpression.replace(". ", ".");
    params.UpdateExpression = params.UpdateExpression.slice(0, -1);
    await this.update(params);
  }

  public static async logMachineExecution(
    project: IProjectDetails,
    execution: IExecutionDetails,
    machineConfig: IMachineDetails,
    message: string,
    logLevel: LogLevel
  ) {
    console.log(
      "machineGuid: " +
        machineConfig.Id +
        " logLevel: " +
        logLevel +
        " message: " +
        message
    );

    const params: AWS.DynamoDB.Types.UpdateItemInput = {
      UpdateExpression:
        "set Executions[" +
        execution.index +
        "].Machines[" +
        machineConfig.index +
        "].MachineLogs = list_append(Executions[" +
        execution.index +
        "].Machines[" +
        machineConfig.index +
        "].MachineLogs, :i)",
      ExpressionAttributeValues: {
        ":i": {
          L: [
            {
              M: {
                Message: { S: message },
                LogLevel: { S: logLevel },
                LogTime: { N: Date.now().toString() },
              },
            },
          ],
        },
      },
      ReturnValues: "UPDATED_NEW",
      TableName: "projects",
      Key: {
        PartitionKey: { S: project.PartitionKey },
      },
    };
    await this.update(params);
  }

  public static async getProjectDetails(
    projectId: string
  ): Promise<IProjectDetails> {
    console.log("projectId: " + projectId);
    const ddb = new AWS.DynamoDB();
    const params = {
      ExpressionAttributeValues: {
        ":p": { S: projectId },
      },
      KeyConditionExpression: "PartitionKey = :p",
      TableName: "projects",
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
        const item = data.Items[0];
        if (item == undefined) {
          reject("No data found");
          return;
        }
        const project: IProjectDetails = {
          PartitionKey: item.PartitionKey.S ?? "",
          // AWS_ACCESS_KEY: item.AWS_ACCESS_KEY.S??'',
          // AWS_REGION:item.AWS_REGION.S??'',
          // AWS_SECRET_ACCESS_KEY: item.AWS_SECRET_ACCESS_KEY.S??'',
          S3_BUCKET: item.S3_BUCKET.S ?? "",
          S3_PROJECT_ZIP: item.S3_PROJECT_ZIP.S ?? "",
          Executions: [],
        };
        if (item.Executions != undefined) {
          for (let i = 0; i < item.Executions.L?.length; i++) {
            const e = item.Executions.L[i];
            const ex: IExecutionDetails = {
              Id: e.M?.Id.S ?? "",
              index: i,
              machinesNumber: parseInt(e.M?.MachinesNumber.N),
              Machines: [],
              ExecutionStatus: e.M?.ExecutionStatus.S as ExecutionStatus,
            };
            project.Executions.push(ex);
            if (e.M?.Machines != undefined) {
              for (let j = 0; j < e.M?.Machines.L?.length; j++) {
                const m = e.M?.Machines.L[j];
                const ma: IMachineDetails = {
                  Id: m.M?.Id.S ?? "",
                  index: j,
                  MachineStatus: m.M?.MachineStatus.S as MachineStatus,
                  Message: m.M?.Message.S ?? "",
                  MachineLogs:
                    e.M?.MachineLogs?.L?.map((l) => {
                      return {
                        Message: l.M?.Message.S ?? "",
                        LogLevel: l.M?.LogLevel.S as LogLevel,
                        LogTime: parseInt(l.M?.LogTime.N),
                      };
                    }) ?? [],
                };
                ex.Machines.push(ma);
              }
            }
          }
        }
        resolve(project);
      });
    });
  }

  public static async getExecutionStatus(
    projectId: string,
    execution: IExecutionDetails
  ): Promise<ExecutionStatus> {
    const params = {
      ExpressionAttributeValues: {
        ":p": { S: projectId },
      },
      ProjectionExpression:
        "Executions[" + execution.index + "].ExecutionStatus",
      KeyConditionExpression: "PartitionKey = :p",
      TableName: "projects",
    };
    const item = await this.selectFirst(params);
    if (
      item.Executions.L == undefined ||
      item.Executions.L[execution.index] == undefined
    ) {
      throw new Error("Execution not found");
    }
    const status = item.Executions.L[execution.index].M?.ExecutionStatus
      ?.S as ExecutionStatus;
    if (status == undefined) {
      throw new Error("Execution status not found");
    }
    return status;
  }

  private static async update(params: AWS.DynamoDB.Types.UpdateItemInput) {
    const ddb = new AWS.DynamoDB();
    await new Promise<void>((resolve, reject) => {
      ddb.updateItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
          return;
        }
        console.log("Success", data);
        resolve();
      });
    });
  }

  private static async selectFirst(
    params: AWS.DynamoDB.QueryInput
  ): Promise<AttributeMap> {
    const items = await this.select(params);
    if (items.length == 0 || items[0] == undefined) {
      throw new Error("No data found");
    }
    return items[0];
  }

  private static async select(
    params: AWS.DynamoDB.QueryInput
  ): Promise<ItemList> {
    const ddb = new AWS.DynamoDB();
    params.TableName = "projects";
    return await new Promise<ItemList>((resolve, reject) => {
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
        resolve(data.Items);
      });
    });
  }
}
