
#Api gateway
resource "aws_api_gateway_rest_api" "ts_lambda" {
  name        = "tf-${var.name}"
}

resource "aws_api_gateway_method" "ts_lambda_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.ts_lambda.id}"
  resource_id   = "${aws_api_gateway_rest_api.ts_lambda.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "ts_lambda_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.ts_lambda.id}"
  resource_id   = "${aws_api_gateway_rest_api.ts_lambda.root_resource_id}"
  http_method = "${aws_api_gateway_method.ts_lambda_root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.ts_lambda.invoke_arn}"
}

resource "aws_api_gateway_resource" "ts_lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.ts_lambda.id}"
  parent_id   = "${aws_api_gateway_rest_api.ts_lambda.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "ts_lambda" {
  rest_api_id   = "${aws_api_gateway_rest_api.ts_lambda.id}"
  resource_id   = "${aws_api_gateway_resource.ts_lambda.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "ts_lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.ts_lambda.id}"
  resource_id = "${aws_api_gateway_method.ts_lambda.resource_id}"
  http_method = "${aws_api_gateway_method.ts_lambda.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.ts_lambda.invoke_arn}"
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.ts_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.region}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.ts_lambda.id}/*/*"
}

module "cors" {
  source = "github.com/carrot/terraform-api-gateway-cors-module"
  resource_id = "${aws_api_gateway_resource.ts_lambda.id}"
  rest_api_id = "${aws_api_gateway_rest_api.ts_lambda.id}"
}

resource "aws_api_gateway_deployment" "ts_lambda" {
  depends_on = [module.cors, aws_api_gateway_integration.ts_lambda]
  rest_api_id = "${aws_api_gateway_rest_api.ts_lambda.id}"
  stage_name  = "${var.name}"
}