resource "aws_docdb_subnet_group" "ts_lambda" {
  name       = "tf-${var.name}"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_docdb_cluster_instance" "ts_lambda" {
  count              = 1
  identifier         = "tf-${var.name}-${count.index}"
  cluster_identifier = "${aws_docdb_cluster.ts_lambda.id}"
  instance_class     = "${var.docdb_instance_class}"
}

resource "aws_docdb_cluster" "ts_lambda" {
  skip_final_snapshot     = true
  db_subnet_group_name    = "${aws_docdb_subnet_group.ts_lambda.name}"
  cluster_identifier      = "tf-${var.name}"
  engine                  = "docdb"
  master_username         = "tf_${replace(var.name, "-", "_")}_admin"
  master_password         = "${var.docdb_password}"
  db_cluster_parameter_group_name = "${aws_docdb_cluster_parameter_group.ts_lambda.name}"
  vpc_security_group_ids = ["${aws_security_group.ts_lambda.id}"]
}

resource "aws_docdb_cluster_parameter_group" "ts_lambda" {
  family = "docdb5.0"
  name = "tf-${var.name}"

  parameter {
    name  = "tls"
    value = "disabled"
  }
}