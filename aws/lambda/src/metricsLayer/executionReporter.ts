import { Collection } from "mongodb";
import InstanceVars from "../lambdaContext/instanceVars";
import { Collections } from "./requestRepoter";
import { EExecutionStatus, IExecution } from "typesafe/IExecution";
import PlanReporter from "./planReporter";

export default class ExecutionReporter {
  private static get executions(): Promise<Collection<IExecution>> {
    const executions = InstanceVars.var.db.getCollection<IExecution>(
      Collections.Executions
    );
    return executions;
  }

  private static async getExecution(
    executionId: string
  ): Promise<IExecution | undefined> {
    const executions = await this.executions;
    const execution = await executions.findOne({
      _id: executionId,
    });
    return execution ?? undefined;
  }
  public static async beginExecution(): Promise<void> {
    console.log("report: beginning execution");
    const executions = await this.executions;
    const plan = PlanReporter.findPlan(InstanceVars.request.planId);
    if (plan == undefined) {
      throw new Error("plan not found");
    }
    if (
      (await ExecutionReporter.getExecution(
        InstanceVars.request.executionId
      )) == undefined
    ) {
      console.log("report: inserting execution");
      await executions.insertOne({
        _id: InstanceVars.request.executionId,
        planId: InstanceVars.request.planId,
        status: EExecutionStatus.Pending,
      });
    }
    console.log("report: updating execution");
    await executions.updateOne(
      {
        _id: InstanceVars.request.executionId,
      },
      {
        $set: {
          status: EExecutionStatus.Running,
          startTimestamp: Date.now(),
        },
      }
    );
  }
  public static async endExecution(): Promise<void> {
    console.log("report: end execution");
    const executions = await this.executions;
    console.log("report: updating execution");
    await executions.updateOne(
      {
        _id: InstanceVars.request.executionId,
      },
      {
        $set: {
          status: EExecutionStatus.Completed,
          endTimestamp: Date.now(),
        },
      }
    );
  }
  public static async failedExecution(): Promise<void> {
    try {
      console.log("report: failed execution");
      const executions = await this.executions;
      console.log("report: updating execution");
      await executions.updateOne(
        {
          _id: InstanceVars.request.executionId,
        },
        {
          $set: {
            status: EExecutionStatus.Failed,
            endTimestamp: Date.now(),
          },
        }
      );
    } catch (e) {
      console.log(`Error: ${JSON.stringify(e, null, 2)}`);
    }
  }
}
