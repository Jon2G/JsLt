variable "lambdasVersion" {
  type        = string
  description = "version of the lambdas zip on S3"
}
#Document db
variable "name" {
  default = "jslt"
}
variable "region" {
  default = "us-east-1"
}
variable "docdb_instance_class" {
  default = "db.t3.medium"
}
variable "docdb_password" {
  default = "689865541998"
}
variable "main_domain" {
  default = ""
}
variable "source_dir" {
  default = "./../packages"
}

variable "layer_skip_destroy" {
  description = "Whether to retain the old version of a previously deployed Lambda Layer."
  type        = bool
  default     = false
}

variable "s3_bucket" {
  default = "jslt-aws-s3-bucket-terraform-state"
}

variable "baseLayerZip" {
  default = "./../lambda/layers/baseLayer.zip"
  
}