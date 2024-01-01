import { APIGatewayProxyResult } from "aws-lambda";
import InstanceVars from "../lambdaContext/instanceVars";
import { Guid } from "guid-typescript";
import { ExecutionMode } from "typesafe/ExecutionMode";
import { IPlan } from "typesafe/IPlan";
import { Collections } from "./requestRepoter";

export default class PlanReporter {
  public static async executeCreatePlan(): Promise<APIGatewayProxyResult> {
    let plan = InstanceVars.request.plan;
    if (plan == undefined) {
      throw new Error("plan is undefined");
    }
    if (plan._id == undefined) {
      plan._id = Guid.create().toString();
    }
    if (plan.mode == undefined) {
      plan.mode = ExecutionMode.Once;
    }
    if (plan.spaceBetween == 0) {
      plan.spaceBetween = Math.floor(Math.random() * 1000 * 10);
    }
    if (plan.numberOfExecutions == undefined || plan.numberOfExecutions <= 0) {
      throw new Error("numberOfExecutions is undefined or less than 0");
    }
    const collection = await InstanceVars.db.getCollection<IPlan>(
      Collections.Plans
    );
    const currentPlan = await collection.findOne({ _id: plan._id });
    if (currentPlan != undefined) {
      plan = {
        ...currentPlan,
        ...plan,
      };
    }
    plan = (await collection.findOneAndUpdate(
      { _id: plan._id },
      { $set: plan },
      { upsert: true }
    )) as IPlan;
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Plan updated",
        plan: plan,
      }),
    };
  }

  public static async findPlan(planId: string) {
    const collection = await InstanceVars.db.getCollection<IPlan>(
      Collections.Plans
    );
    const currentPlan = await collection.findOne({
      _id:planId ,
    });
    InstanceVars.request.plan = currentPlan!;
    return currentPlan;
  }
}
