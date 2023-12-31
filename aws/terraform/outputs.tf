output "url" {
  value = "${var.main_domain != "" ? "https://${var.name}.${var.main_domain}" : "${aws_api_gateway_deployment.ts_lambda.invoke_url}"}"
}

output "aws_instance_public_dns" {
  value = "${aws_instance.docdb_bastion.public_dns}"
}

output "docdb_endpoint" {
  value = "${aws_docdb_cluster.ts_lambda.endpoint}"
}
output "docdb_port" {
  value = "${aws_docdb_cluster.ts_lambda.port}"
}
output "docdb_username" {
  value = "${aws_docdb_cluster.ts_lambda.master_username}"
}

output "bucket" {
  value = "${aws_s3_bucket.terraform_state.bucket}"
}

output "bucket_key" {
  value = "zips/lambda_function_${var.lambdasVersion}.zip"
}

output "name" {
  value = "${var.name}"
}

output "victim_ec2_aws_eip" {
  value = "${aws_instance.victim_ec2.public_ip}"
}