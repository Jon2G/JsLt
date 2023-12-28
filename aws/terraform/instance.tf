data "aws_ami" "latest_amz_linux" {
  most_recent = true
  filter {
    name   = "name"
    values = ["amzn2-ami-kernel*"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["amazon"]
}

resource "aws_instance" "docdb_bastion" {
  ami = data.aws_ami.latest_amz_linux.id
  vpc_security_group_ids = [
    aws_security_group.ts_lambda.id,
    aws_security_group.ingress_ssh.id
  ]
  subnet_id     = module.vpc.public_subnets[0]
  instance_type = "t2.micro"
  key_name      = aws_key_pair.ts_lambda.key_name
  associate_public_ip_address = true
  connection {
    host        = self.public_ip
    type        = "ssh"
    user        = "ec2-user"
    private_key = tls_private_key.ts_lambda.private_key_pem
  }
}

resource "tls_private_key" "ts_lambda" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ts_lambda" {
  key_name   = "tf-${var.name}-ec2"
  public_key = tls_private_key.ts_lambda.public_key_openssh
}

resource "local_file" "ts_lambda_private_key" {
  content         = tls_private_key.ts_lambda.private_key_pem
  filename        = "docdb-bastion.pem" #aws_key_pair.ts_lambda.key_name
  file_permission = "0400"
}
