import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import DocumentDbConnection from "../documentDb/connection";
import { IRequest } from "typesafe/IRequest";
import InstanceVars from "./instanceVars";
import ExecutionReporter from "../metricsLayer/executionReporter";
import { ExceptionUtils } from "./exceptionUtils";
import { Collections } from "../metricsLayer/requestRepoter";
import { IPlan } from "typesafe/IPlan";
import { Guid } from "guid-typescript";
import { ExecutionMode } from "typesafe/ExecutionMode";
import PlanReporter from "../metricsLayer/planReporter";

export default class HandlerEntryPoint {
  public static async run(
    event: APIGatewayEvent,
    context: Context,
    handler: () => Promise<APIGatewayProxyResult>
  ): Promise<APIGatewayProxyResult> {
    let con: DocumentDbConnection | undefined = undefined;
    try {
      console.log("running handler");
      console.log(`Event: ${JSON.stringify(event, null, 2)}`);
      console.log(`Context: ${JSON.stringify(context, null, 2)}`);
      if (event.body == null && event.body == undefined) {
        throw new Error("event.body is null or undefined");
      }
      const request: IRequest = JSON.parse(event.body); //use in case of JSON body
      console.log(`Request: ${JSON.stringify(request, null, 2)}`);
      if (
        request == null ||
        request == undefined ||
        request.action == undefined
      ) {
        throw new Error("request is null or undefined");
      }
      process.env["executionId"] = request.executionId;

      con = new DocumentDbConnection();
      await con.connect();
      InstanceVars.var = {
        request: request,
        db: con,
      };
      let response: APIGatewayProxyResult;
      switch (request.action) {
        case "CreatePlan":
          response = await PlanReporter.executeCreatePlan();
          break;
        case "Execute":
          response = await HandlerEntryPoint.execute(handler);
          break;
        default:
          throw new Error("request.action is not valid");
      }
      return response;
    } catch (e: any) {
      await ExecutionReporter.failedExecution();
      console.log(`Error: ${JSON.stringify(e, null, 2)}`);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: ExceptionUtils.getExceptionMessage(e),
          stack: e?.stack,
        }),
      };
    } finally {
      if (con != undefined) {
        await con.disconnect();
      }
    }
  }

  private static async execute(
    handler: () => Promise<APIGatewayProxyResult>
  ): Promise<APIGatewayProxyResult> {
    const request = InstanceVars.request;
    if (request.executionId == undefined || request.planId == undefined) {
      throw new Error("executionId or planId is undefined");
    }
    await ExecutionReporter.beginExecution();
    const response = await handler();
    console.log(`Response: ${JSON.stringify(response, null, 2)}`);
    await ExecutionReporter.endExecution();
    return response;
  }


}
