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