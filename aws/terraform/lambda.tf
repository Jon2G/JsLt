resource "aws_lambda_function" "ts_lambda" {
  filename      = "zips/lambda_function_${var.lambdasVersion}.zip"
  function_name = "ts_lambda"
  role          = aws_iam_role.ts_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  memory_size   = 1024
  timeout       = 300

  vpc_config {
    subnet_ids         = module.vpc.public_subnets
    security_group_ids = ["${aws_security_group.ts_lambda.id}"]
  }

  environment {
    variables = {
      DB_CONNECTION_STRING = "mongodb://${aws_docdb_cluster.ts_lambda.master_username}:${aws_docdb_cluster.ts_lambda.master_password}@${aws_docdb_cluster.ts_lambda.endpoint}:${aws_docdb_cluster.ts_lambda.port}"
    }
  }

}

resource "aws_lambda_function_url" "ts_lambda_funtion_url" {
  function_name      = aws_lambda_function.ts_lambda.id
  authorization_type = "NONE"
  cors {
    allow_origins = ["*"]
  }
}