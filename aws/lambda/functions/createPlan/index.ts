import {
  Context,
  APIGatewayProxyResult,
  APIGatewayEvent,
} from "aws-lambda";
export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  await Promise.resolve();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "createPlan",
    }),
  };
}
