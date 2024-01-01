import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";
import HandlerEntryPoint from "shared/lambdaContext/handlerWrapper";
import { testRun } from "./test";

export function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  return HandlerEntryPoint.run(event, context, async () => {
    //
    //User test code here
    await testRun();
    //
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "test-done",
      }),
    };
  });
}
