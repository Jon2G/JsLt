resource "random_uuid" "this" {
  count = 1#ar.create_function && !var.create_layer ? 1 : 0
  keepers = {
    for filename in fileset(var.source_dir, "**/*") :
    filename => filemd5("${var.source_dir}/${filename}")
  }
}
data "archive_file" "lambda_package" {
  count            = 1#var.create_function && !var.create_layer ? 1 : 0
  type             = "zip"
  output_file_mode = "0666"
  output_path      = "${var.source_dir}/../terraform/zips/lambda_function_${try(random_uuid.this[0].result, "")}.zip"
  source_dir       = var.source_dir
}

resource "aws_s3_object" "layer_package" {
  count  = 1#var.create_layer && !var.create_function ? 1 : 0
  bucket = var.s3_bucket

  key    = basename(abspath(var.baseLayerZip))
  source = abspath(var.baseLayerZip)

  source_hash = filemd5(abspath(var.baseLayerZip))
}

resource "aws_lambda_layer_version" "this" {
  count = 1#var.create_layer && !var.create_function ? 1 : 0

  layer_name               = "${var.name}-baseLayer" #local.layer_name
  #description              = var.description
  compatible_runtimes      = ["nodejs18.x"]
  #compatible_architectures = var.compatible_architectures
  skip_destroy             = var.layer_skip_destroy

  # S3
  s3_bucket         = var.s3_bucket
  s3_key            = aws_s3_object.layer_package[0].key
  s3_object_version = aws_s3_object.layer_package[0].version_id
  source_code_hash  = filebase64sha256(var.baseLayerZip)
}


resource "aws_lambda_function" "ts_lambda" {
  depends_on = [ aws_instance.victim_ec2 ]
  #filename      = "zips/lambda_function_${var.lambdasVersion}.zip"
  filename = data.archive_file.lambda_package[0].output_path
  function_name = "ts_lambda"
  role          = aws_iam_role.ts_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  memory_size   = 1024
  timeout       = 300
  layers        = [aws_lambda_layer_version.this[0].arn]

  vpc_config {
    subnet_ids         = module.vpc.public_subnets
    security_group_ids = ["${aws_security_group.ts_lambda.id}"]
  }

  environment {
    variables = {
      //mongodb://${username}:${params.password}@${params.host}:27017/cofepris?tls=true&tlsCAFile=/opt/nodejs/global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false
      DB_CONNECTION_STRING = "mongodb://${aws_docdb_cluster.ts_lambda.master_username}:${aws_docdb_cluster.ts_lambda.master_password}@${aws_docdb_cluster.ts_lambda.endpoint}:${aws_docdb_cluster.ts_lambda.port}/jslt?tls=false&tlsCAFile=/opt/nodejs/docdb-bastion.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false",
      TESTING_IP = aws_instance.victim_ec2.private_ip
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