resource "aws_s3_bucket" "terraform_state" {
  force_destroy = true
  bucket = var.s3_bucket

  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = false
  }
}