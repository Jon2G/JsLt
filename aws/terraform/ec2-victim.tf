# Get latest Ubuntu Linux Focal Fossa 20.04 AMI
data "aws_ami" "ubuntu-linux-2004" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Define the security group for the Linux server
resource "aws_security_group" "aws-linux-sg" {
  name        = "linux-sg"
  description = "Allow incoming traffic to the Linux EC2 Instance"
  vpc_id      = module.vpc.vpc_id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow incoming HTTP connections"
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow incoming SSH connections"
  }
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all"
  }
}

locals {
  # Network
  vpc_cidr           = "10.11.0.0/16"
  public_subnet_cidr = "10.0.104.0/24"
  # Linux Virtual Machine
  latest_ubuntu_linux_ami           = data.aws_ami.ubuntu-linux-2004.id
  linux_instance_type               = "t2.micro"
  linux_associate_public_ip_address = true
  linux_root_volume_size            = 20
  linux_root_volume_type            = "gp2"
  linux_data_volume_size            = 10
  linux_data_volume_type            = "gp2"
  aws_az                            = "us-east-1a"
}

# Define the public subnet
resource "aws_subnet" "public-subnet" {
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.public_subnet_cidr
  availability_zone = local.aws_az
}

# Define the public route table
resource "aws_route_table" "public-rt" {
  vpc_id = module.vpc.vpc_id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = module.vpc.igw_id #$ aws_internet_gateway.gw.id
  }
}
# Assign the public route table to the public subnet
resource "aws_route_table_association" "public-rt-association" {
  subnet_id      = aws_subnet.public-subnet.id
  route_table_id = aws_route_table.public-rt.id
}

# Create EC2 Instance
resource "aws_instance" "victim_ec2" {
  ami                         = data.aws_ami.ubuntu-linux-2004.id
  instance_type               = local.linux_instance_type
  subnet_id                   = aws_subnet.public-subnet.id
  vpc_security_group_ids      = [aws_security_group.aws-linux-sg.id]
  associate_public_ip_address = local.linux_associate_public_ip_address
  source_dest_check           = false
  key_name                    = aws_key_pair.ts_lambda.key_name
  user_data                   = file("./ec2_victim/aws-user-data.sh")

  # root disk
  root_block_device {
    volume_size           = local.linux_root_volume_size
    volume_type           = local.linux_root_volume_type
    delete_on_termination = true
    encrypted             = true
  }
  # extra disk
  ebs_block_device {
    device_name           = "/dev/xvda"
    volume_size           = local.linux_data_volume_size
    volume_type           = local.linux_data_volume_type
    encrypted             = true
    delete_on_termination = true
  }

  tags = {
    Name = "linux-vm"
  }
}

# # Create Elastic IP for the EC2 instance
# resource "aws_eip" "linux-eip" {
#   #vpc  = true
#   tags = {
#     Name = "linux-eip"
#   }
# }
# # Associate Elastic IP to Linux Server
# resource "aws_eip_association" "linux-eip-association" {
#   instance_id   = aws_instance.victim_ec2.id
#   allocation_id = aws_eip.linux-eip.id
# }
