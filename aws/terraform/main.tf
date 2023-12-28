provider "aws" {
  region = "us-east-1"
  profile= "jon2g-jslt"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.47.0"
    }
  }
 backend "s3" {
   profile= "jon2g-jslt"
   bucket = "jslt-aws-s3-bucket-terraform-state"
   key    = "my_lambda/terraform.tfstate"
   region = "us-east-1"
 }
}



resource "aws_s3_bucket" "terraform_state" {
  bucket = "jslt-aws-s3-bucket-terraform-state"

  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_iam_role" "ts_lambda_role" {
  name = "ts_lambda_role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "ts_lambda" {
  filename      = "zips/lambda_function_${var.lambdasVersion}.zip"
  function_name = "ts_lambda"
  role          = aws_iam_role.ts_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  memory_size   = 1024
  timeout       = 300
}

resource "aws_cloudwatch_log_group" "ts_lambda_loggroup" {
  name              = "/aws/lambda/${aws_lambda_function.ts_lambda.function_name}"
  retention_in_days = 3
}

data "aws_iam_policy_document" "ts_lambda_policy" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      aws_cloudwatch_log_group.ts_lambda_loggroup.arn,
      "${aws_cloudwatch_log_group.ts_lambda_loggroup.arn}:*"
    ]
  }
}

resource "aws_iam_role_policy" "ts_lambda_role_policy" {
  policy = data.aws_iam_policy_document.ts_lambda_policy.json
  role   = aws_iam_role.ts_lambda_role.id
  name   = "my-lambda-policy"
}

resource "aws_lambda_function_url" "ts_lambda_funtion_url" {
  function_name      = aws_lambda_function.ts_lambda.id
  authorization_type = "NONE"
  cors {
    allow_origins = ["*"]
  }
}