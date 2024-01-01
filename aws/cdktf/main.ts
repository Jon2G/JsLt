import * as cdktf from "cdktf";
/*Provider bindings are generated by running cdktf get.
See https://cdk.tf/provider-generation for more details.*/
import * as archive from "./.gen/providers/archive";
import * as aws from "./.gen/providers/aws";
import * as local from "./.gen/providers/local";
import * as random from "./.gen/providers/random";
import * as tls from "./.gen/providers/tls";
import * as TerraformApiGatewayCorsModule from "./.gen/modules/carrot/terraform-api-gateway-cors-module";
import * as Vpc from "./.gen/modules/terraform-aws-modules/aws/vpc";
import * as fs from "fs";
import * as crypto from "crypto";

// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new cdktf.S3Backend(this, {
      bucket: "jslt-aws-s3-bucket-terraform-state",
      key: "my_lambda/terraform.tfstate",
      profile: "jon2g-jslt",
      region: "us-east-1",
    });
    /*Terraform Variables are not always the best fit for getting inputs in the context of Terraform CDK.
You can read more about this at https://cdk.tf/variables*/
    new aws.provider.AwsProvider(this, "aws", {
      profile: "jon2g-jslt",
      region: "us-east-1",
    });
    const baseLayerZip = new cdktf.TerraformVariable(this, "baseLayerZip", {
      default: "./../lambda/layers/baseLayer.zip",
    });
    const docdbInstanceClass = new cdktf.TerraformVariable(
      this,
      "docdb_instance_class",
      {
        default: "db.t3.medium",
      }
    );
    const docdbPassword = new cdktf.TerraformVariable(this, "docdb_password", {
      default: "689865541998",
    });
    const lambdasVersion = new cdktf.TerraformVariable(this, "lambdasVersion", {
      description: "version of the lambdas zip on S3",
    });
    const layerSkipDestroy = new cdktf.TerraformVariable(
      this,
      "layer_skip_destroy",
      {
        default: false,
        description:
          "Whether to retain the old version of a previously deployed Lambda Layer.",
      }
    );
    const mainDomain = new cdktf.TerraformVariable(this, "main_domain", {
      default: "",
    });
    const name = new cdktf.TerraformVariable(this, "name", {
      default: "jslt",
    });
    const region = new cdktf.TerraformVariable(this, "region", {
      default: "us-east-1",
    });
    const s3Bucket = new cdktf.TerraformVariable(this, "s3_bucket", {
      default: "jslt-aws-s3-bucket-terraform-state",
    });
    const sourceDir = new cdktf.TerraformVariable(this, "source_dir", {
      default: "./../packages",
    });
    const lamdaFunctionsDir = new cdktf.TerraformVariable(this, "lamda_functions_dir", {
      default: "./../lambda/functions",
    });
    const awsAz = "us-east-1a";
    const linuxAssociatePublicIpAddress = true;
    const linuxDataVolumeSize = 10;
    const linuxDataVolumeType = "gp2";
    const linuxInstanceType = "t2.micro";
    const linuxRootVolumeSize = 20;
    const linuxRootVolumeType = "gp2";
    const publicSubnetCidr = "10.0.104.0/24";
    new cdktf.TerraformOutput(this, "bucket_key", {
      value: `zips/lambda_function_\${${lambdasVersion.value}}.zip`,
    });
    const cdktfTerraformOutputName = new cdktf.TerraformOutput(
      this,
      "name_12",
      {
        value: name.value,
      }
    );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    cdktfTerraformOutputName.overrideLogicalId("name");
    const vpc = new Vpc.Vpc(this, "vpc", {
      azs: [
        `\${${region.value}}a`,
        `\${${region.value}}b`,
        `\${${region.value}}c`,
      ],
      cidr: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      enableNatGateway: false,
      enableVpnGateway: true,
      manageDefaultNetworkAcl: true,
      manageDefaultRouteTable: true,
      manageDefaultSecurityGroup: true,
      name: `tf-\${${name.value}}`,
      privateSubnets: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
      publicSubnets: ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"],
      singleNatGateway: false,
    });
    const awsApiGatewayRestApiTsLambda =
      new aws.apiGatewayRestApi.ApiGatewayRestApi(this, "ts_lambda", {
        name: `tf-\${${name.value}}`,
      });
    const awsDocdbClusterParameterGroupTsLambda =
      new aws.docdbClusterParameterGroup.DocdbClusterParameterGroup(
        this,
        "ts_lambda_15",
        {
          family: "docdb5.0",
          name: `tf-\${${name.value}}`,
          parameter: [
            {
              name: "tls",
              value: "disabled",
            },
          ],
        }
      );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsDocdbClusterParameterGroupTsLambda.overrideLogicalId("ts_lambda");
    const awsDocdbSubnetGroupTsLambda =
      new aws.docdbSubnetGroup.DocdbSubnetGroup(this, "ts_lambda_16", {
        name: `tf-\${${name.value}}`,
        subnetIds: [vpc.privateSubnetsOutput],
      });
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsDocdbSubnetGroupTsLambda.overrideLogicalId("ts_lambda");
    const awsIamRoleTsLambdaRole = new aws.iamRole.IamRole(
      this,
      "ts_lambda_role",
      {
        assumeRolePolicy:
          '${jsonencode({\n    Version = "2012-10-17"\n    Statement = [\n      {\n        Action = "sts:AssumeRole"\n        Effect = "Allow"\n        Principal = {\n          Service = "lambda.amazonaws.com"\n        }\n      }\n    ]\n  })}',
        name: "ts_lambda_role",
      }
    );
    new aws.iamRolePolicyAttachment.IamRolePolicyAttachment(
      this,
      "AWSLambdaVPCAccessExecutionRole",
      {
        policyArn:
          "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole",
        role: awsIamRoleTsLambdaRole.name,
      }
    );
    const awsRouteTablePublicRt = new aws.routeTable.RouteTable(
      this,
      "public-rt",
      {
        route: [
          {
            cidrBlock: "0.0.0.0/0",
            gatewayId: vpc.igwIdOutput,
          },
        ],
        vpcId: vpc.vpcIdOutput,
      }
    );
    const awsS3BucketTerraformState = new aws.s3Bucket.S3Bucket(
      this,
      "terraform_state",
      {
        bucket: s3Bucket.value,
        forceDestroy: true,
      }
    );
    awsS3BucketTerraformState.addOverride("lifecycle", [
      {
        prevent_destroy: false,
      },
    ]);
    const awsS3ObjectLayerPackage = new aws.s3Object.S3Object(
      this,
      "layer_package",
      {
        bucket: s3Bucket.value,
        key: `\${basename(abspath(${baseLayerZip.value}))}`,
        source: `\${abspath(${baseLayerZip.value})}`,
        sourceHash: `\${filemd5(abspath(${baseLayerZip.value}))}`,
      }
    );
    /*In most cases loops should be handled in the programming language context and 
not inside of the Terraform context. If you are looping over something external, e.g. a variable or a file input
you should consider using a for loop. If you are looping over something only known to Terraform, e.g. a result of a data source
you need to keep this like it is.*/
    awsS3ObjectLayerPackage.addOverride("count", 1);
    const awsSecurityGroupAwsLinuxSg = new aws.securityGroup.SecurityGroup(
      this,
      "aws-linux-sg",
      {
        description: "Allow incoming traffic to the Linux EC2 Instance",
        egress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            description: "Allow all",
            fromPort: 0,
            protocol: "-1",
            toPort: 0,
          },
        ],
        ingress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            description: "Allow incoming HTTP connections",
            fromPort: 80,
            protocol: "tcp",
            toPort: 80,
          },
          {
            cidrBlocks: ["0.0.0.0/0"],
            description: "Allow incoming SSH connections",
            fromPort: 22,
            protocol: "tcp",
            toPort: 22,
          },
          {
            cidrBlocks: ["0.0.0.0/0"],
            description: "Allow all",
            fromPort: 0,
            protocol: "-1",
            toPort: 0,
          },
        ],
        name: "linux-sg",
        vpcId: vpc.vpcIdOutput,
      }
    );
    const awsSecurityGroupIngressSsh = new aws.securityGroup.SecurityGroup(
      this,
      "ingress_ssh",
      {
        description: "Allow inbound SSH connections",
        egress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            description: "Allow all egress traffic",
            fromPort: 0,
            ipv6CidrBlocks: ["::/0"],
            protocol: "-1",
            toPort: 0,
          },
        ],
        ingress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            description: "Allow SSH ingress traffic",
            fromPort: 22,
            protocol: "tcp",
            toPort: 22,
          },
        ],
        name: `tf-\${${name.value}}-ssh`,
        vpcId: vpc.vpcIdOutput,
      }
    );
    const awsSecurityGroupTsLambda = new aws.securityGroup.SecurityGroup(
      this,
      "ts_lambda_24",
      {
        egress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            fromPort: 0,
            protocol: "-1",
            toPort: 0,
          },
        ],
        ingress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            fromPort: 0,
            protocol: "-1",
            toPort: 0,
          },
        ],
        name: `tf-\${${name.value}}`,
        vpcId: vpc.vpcIdOutput,
      }
    );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsSecurityGroupTsLambda.overrideLogicalId("ts_lambda");
    const awsSubnetPublicSubnet = new aws.subnet.Subnet(this, "public-subnet", {
      availabilityZone: awsAz,
      cidrBlock: publicSubnetCidr,
      vpcId: vpc.vpcIdOutput,
    });
    console.log({ sourceDir: sourceDir.value })
    const filesKeepers = fs.readdirSync(sourceDir.value).map((filename) => {
      return {
        name: filename,
        md5: crypto
          .createHash("md5")
          .update(fs.readFileSync(`${sourceDir.value}/${filename}`))
          .digest("hex"),
      };
    });
    const keepers: { [key: string]: string } = {};
    for (const file of filesKeepers) {
      keepers[file.name] = file.md5;
    }
    const randomUuidThis = new random.uuid.Uuid(this, "this", {
      keepers: keepers,
      //      `\${{
      //   for filename in fileset(${sourceDir.value}, "**/*") :
      //   filename => filemd5("\${var.source_dir}/\${filename}")
      // }}`,
    });
    /*In most cases loops should be handled in the programming language context and 
not inside of the Terraform context. If you are looping over something external, e.g. a variable or a file input
you should consider using a for loop. If you are looping over something only known to Terraform, e.g. a result of a data source
you need to keep this like it is.*/
    randomUuidThis.addOverride("count", 1);
    const tlsPrivateKeyTsLambda = new tls.privateKey.PrivateKey(
      this,
      "ts_lambda_27",
      {
        algorithm: "RSA",
        rsaBits: 4096,
      }
    );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    tlsPrivateKeyTsLambda.overrideLogicalId("ts_lambda");
    const dataArchiveFileLambdaPackage =
      new archive.dataArchiveFile.DataArchiveFile(this, "lambda_package", {
        outputFileMode: "0666",
        outputPath: `\${${sourceDir.value}}/../terraform/zips/lambda_function_\${try(${randomUuidThis.fqn}[0].result, "")}.zip`,
        sourceDir: sourceDir.value,
        type: "zip",
      });
    /*In most cases loops should be handled in the programming language context and 
not inside of the Terraform context. If you are looping over something external, e.g. a variable or a file input
you should consider using a for loop. If you are looping over something only known to Terraform, e.g. a result of a data source
you need to keep this like it is.*/
    dataArchiveFileLambdaPackage.addOverride("count", 1);
    const dataAwsAmiLatestAmzLinux = new aws.dataAwsAmi.DataAwsAmi(
      this,
      "latest_amz_linux",
      {
        filter: [
          {
            name: "name",
            values: ["amzn2-ami-kernel*"],
          },
          {
            name: "architecture",
            values: ["x86_64"],
          },
          {
            name: "virtualization-type",
            values: ["hvm"],
          },
        ],
        mostRecent: true,
        owners: ["amazon"],
      }
    );
    const dataAwsAmiUbuntuLinux2004 = new aws.dataAwsAmi.DataAwsAmi(
      this,
      "ubuntu-linux-2004",
      {
        filter: [
          {
            name: "name",
            values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
          },
          {
            name: "virtualization-type",
            values: ["hvm"],
          },
        ],
        mostRecent: true,
        owners: ["099720109477"],
      }
    );
    const dataAwsCallerIdentityCurrent =
      new aws.dataAwsCallerIdentity.DataAwsCallerIdentity(this, "current", {});
    new cdktf.TerraformOutput(this, "bucket", {
      value: awsS3BucketTerraformState.bucket,
    });
    const awsApiGatewayMethodTsLambdaRoot =
      new aws.apiGatewayMethod.ApiGatewayMethod(this, "ts_lambda_root", {
        authorization: "NONE",
        httpMethod: "ANY",
        resourceId: awsApiGatewayRestApiTsLambda.rootResourceId,
        restApiId: awsApiGatewayRestApiTsLambda.id,
      });
    const awsApiGatewayResourceTsLambda =
      new aws.apiGatewayResource.ApiGatewayResource(this, "ts_lambda_34", {
        parentId: awsApiGatewayRestApiTsLambda.rootResourceId,
        pathPart: "{proxy+}",
        restApiId: awsApiGatewayRestApiTsLambda.id,
      });
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsApiGatewayResourceTsLambda.overrideLogicalId("ts_lambda");
    const awsDocdbClusterTsLambda = new aws.docdbCluster.DocdbCluster(
      this,
      "ts_lambda_35",
      {
        clusterIdentifier: `tf-\${${name.value}}`,
        dbClusterParameterGroupName: awsDocdbClusterParameterGroupTsLambda.name,
        dbSubnetGroupName: awsDocdbSubnetGroupTsLambda.name,
        engine: "docdb",
        masterPassword: docdbPassword.value,
        masterUsername: `tf_\${replace(${name.value}, "-", "_")}_admin`,
        skipFinalSnapshot: true,
        vpcSecurityGroupIds: [awsSecurityGroupTsLambda.id],
      }
    );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsDocdbClusterTsLambda.overrideLogicalId("ts_lambda");
    const awsDocdbClusterInstanceTsLambda =
      new aws.docdbClusterInstance.DocdbClusterInstance(this, "ts_lambda_36", {
        clusterIdentifier: awsDocdbClusterTsLambda.id,
        identifier: `tf-\${${name.value}}-\${count.index}`,
        instanceClass: docdbInstanceClass.value,
      });
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsDocdbClusterInstanceTsLambda.overrideLogicalId("ts_lambda");
    /*In most cases loops should be handled in the programming language context and 
not inside of the Terraform context. If you are looping over something external, e.g. a variable or a file input
you should consider using a for loop. If you are looping over something only known to Terraform, e.g. a result of a data source
you need to keep this like it is.*/
    awsDocdbClusterInstanceTsLambda.addOverride("count", 1);
    const awsKeyPairTsLambda = new aws.keyPair.KeyPair(this, "ts_lambda_37", {
      keyName: `tf-\${${name.value}}-ec2`,
      publicKey: tlsPrivateKeyTsLambda.publicKeyOpenssh,
    });
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsKeyPairTsLambda.overrideLogicalId("ts_lambda");
    const awsLambdaLayerVersionThis =
      new aws.lambdaLayerVersion.LambdaLayerVersion(this, "this_38", {
        compatibleRuntimes: ["nodejs18.x"],
        layerName: `\${${name.value}}-baseLayer`,
        s3Bucket: s3Bucket.value,
        s3Key: `\${${awsS3ObjectLayerPackage.fqn}[0].key}`,
        s3ObjectVersion: `\${${awsS3ObjectLayerPackage.fqn}[0].version_id}`,
        skipDestroy: layerSkipDestroy.value,
        sourceCodeHash: `\${filebase64sha256(${baseLayerZip.value})}`,
      });
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsLambdaLayerVersionThis.overrideLogicalId("this");
    /*In most cases loops should be handled in the programming language context and 
not inside of the Terraform context. If you are looping over something external, e.g. a variable or a file input
you should consider using a for loop. If you are looping over something only known to Terraform, e.g. a result of a data source
you need to keep this like it is.*/
    awsLambdaLayerVersionThis.addOverride("count", 1);
    new aws.routeTableAssociation.RouteTableAssociation(
      this,
      "public-rt-association",
      {
        routeTableId: awsRouteTablePublicRt.id,
        subnetId: awsSubnetPublicSubnet.id,
      }
    );
    new local.file.File(this, "ts_lambda_private_key", {
      content: tlsPrivateKeyTsLambda.privateKeyPem,
      filePermission: "0400",
      filename: "docdb-bastion.pem",
    });
    new cdktf.TerraformOutput(this, "docdb_endpoint", {
      value: awsDocdbClusterTsLambda.endpoint,
    });
    new cdktf.TerraformOutput(this, "docdb_port", {
      value: awsDocdbClusterTsLambda.port,
    });
    new cdktf.TerraformOutput(this, "docdb_username", {
      value: awsDocdbClusterTsLambda.masterUsername,
    });
    const cors =
      new TerraformApiGatewayCorsModule.TerraformApiGatewayCorsModule(
        this,
        "cors",
        {
          resourceId: awsApiGatewayResourceTsLambda.id,
          restApiId: awsApiGatewayRestApiTsLambda.id,
        }
      );
    const awsApiGatewayMethodTsLambda =
      new aws.apiGatewayMethod.ApiGatewayMethod(this, "ts_lambda_45", {
        authorization: "NONE",
        httpMethod: "ANY",
        resourceId: awsApiGatewayResourceTsLambda.id,
        restApiId: awsApiGatewayRestApiTsLambda.id,
      });
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsApiGatewayMethodTsLambda.overrideLogicalId("ts_lambda");
    const awsInstanceDocdbBastion = new aws.instance.Instance(
      this,
      "docdb_bastion",
      {
        ami: dataAwsAmiLatestAmzLinux.id,
        associatePublicIpAddress: true,
        connection: 
          {
           host: "${self.public_ip}",
           // host: awsInstanceDocdbBastion.publicIp,
           privateKey: tlsPrivateKeyTsLambda.privateKeyPem,
            type: "ssh",
            user: "ec2-user",
          },
        
        instanceType: "t2.micro",
        keyName: awsKeyPairTsLambda.keyName,
        //subnetId: `\${${vpc.publicSubnetsOutput.fqn}[0]}`,
        subnetId: vpc.publicSubnetsOutput,
        tags: {
          Name: "docdb-bastion-vm",
        },
        vpcSecurityGroupIds: [
          awsSecurityGroupTsLambda.id,
          awsSecurityGroupIngressSsh.id,
        ],
      }
    );

    const awsInstanceVictimEc2 = new aws.instance.Instance(this, "victim_ec2", {
      ami: dataAwsAmiUbuntuLinux2004.id,
      associatePublicIpAddress: linuxAssociatePublicIpAddress,
      ebsBlockDevice: [
        {
          deleteOnTermination: true,
          deviceName: "/dev/xvda",
          encrypted: true,
          volumeSize: linuxDataVolumeSize,
          volumeType: linuxDataVolumeType,
        },
      ],
      instanceType: linuxInstanceType,
      keyName: awsKeyPairTsLambda.keyName,
      rootBlockDevice: {
        deleteOnTermination: true,
        encrypted: true,
        volumeSize: linuxRootVolumeSize,
        volumeType: linuxRootVolumeType,
      },
      sourceDestCheck: false,
      subnetId: awsSubnetPublicSubnet.id,
      tags: {
        Name: "linux-vm",
      },
      userData: '${file("./ec2_victim/aws-user-data.sh")}',
      vpcSecurityGroupIds: [awsSecurityGroupAwsLinuxSg.id],
    });
    const awsLambdaFunctionTsLambda = new aws.lambdaFunction.LambdaFunction(
      this,
      "ts_lambda_48",
      {
        dependsOn: [awsInstanceVictimEc2], //HERE
        environment: {
          variables: {
            dbConnectionString: `mongodb://\${${awsDocdbClusterTsLambda.masterUsername}}:\${${awsDocdbClusterTsLambda.masterPassword}}@\${${awsDocdbClusterTsLambda.endpoint}}:\${${awsDocdbClusterTsLambda.port}}/jslt?tls=false&tlsCAFile=/opt/nodejs/docdb-bastion.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`,
            testingIp: awsInstanceVictimEc2.privateIp,
          },
        },
        filename: `\${${dataArchiveFileLambdaPackage.fqn}[0].output_path}`,
        functionName: "ts_lambda",
        handler: "index.handler",
        layers: [`\${${awsLambdaLayerVersionThis.fqn}[0].arn}`],
        memorySize: 1024,
        role: awsIamRoleTsLambdaRole.arn,
        runtime: "nodejs18.x",
        timeout: 300,
        vpcConfig: {
          securityGroupIds: [awsSecurityGroupTsLambda.id],
          subnetIds: [vpc.publicSubnetsOutput],
        },
      }
    );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsLambdaFunctionTsLambda.overrideLogicalId("ts_lambda");
    new aws.lambdaFunctionUrl.LambdaFunctionUrl(this, "ts_lambda_funtion_url", {
      authorizationType: "NONE",
      cors: {
        allowOrigins: ["*"],
      },
      functionName: awsLambdaFunctionTsLambda.id,
    });
    new aws.lambdaPermission.LambdaPermission(this, "apigw", {
      action: "lambda:InvokeFunction",
      functionName: awsLambdaFunctionTsLambda.arn,
      principal: "apigateway.amazonaws.com",
      sourceArn: `arn:aws:execute-api:\${${region.value}}:\${${dataAwsCallerIdentityCurrent.accountId}}:\${${awsApiGatewayRestApiTsLambda.id}}/*/*`,
      statementId: "AllowAPIGatewayInvoke",
    });
    new cdktf.TerraformOutput(this, "aws_instance_public_dns", {
      value: awsInstanceDocdbBastion.publicDns,
    });
    new cdktf.TerraformOutput(this, "victim_ec2_aws_eip", {
      value: awsInstanceVictimEc2.publicIp,
    });
    const awsApiGatewayIntegrationTsLambda =
      new aws.apiGatewayIntegration.ApiGatewayIntegration(
        this,
        "ts_lambda_53",
        {
          httpMethod: awsApiGatewayMethodTsLambda.httpMethod,
          integrationHttpMethod: "POST",
          resourceId: awsApiGatewayMethodTsLambda.resourceId,
          restApiId: awsApiGatewayRestApiTsLambda.id,
          type: "AWS_PROXY",
          uri: awsLambdaFunctionTsLambda.invokeArn,
        }
      );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsApiGatewayIntegrationTsLambda.overrideLogicalId("ts_lambda");
    const awsApiGatewayIntegrationTsLambdaRoot =
      new aws.apiGatewayIntegration.ApiGatewayIntegration(
        this,
        "ts_lambda_root_54",
        {
          httpMethod: awsApiGatewayMethodTsLambdaRoot.httpMethod,
          integrationHttpMethod: "POST",
          resourceId: awsApiGatewayRestApiTsLambda.rootResourceId,
          restApiId: awsApiGatewayRestApiTsLambda.id,
          type: "AWS_PROXY",
          uri: awsLambdaFunctionTsLambda.invokeArn,
        }
      );
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsApiGatewayIntegrationTsLambdaRoot.overrideLogicalId("ts_lambda_root");
    const awsCloudwatchLogGroupTsLambdaLoggroup =
      new aws.cloudwatchLogGroup.CloudwatchLogGroup(
        this,
        "ts_lambda_loggroup",
        {
          name: `/aws/lambda/\${${awsLambdaFunctionTsLambda.functionName}}`,
          retentionInDays: 3,
        }
      );
    const dataAwsIamPolicyDocumentTsLambdaPolicy =
      new aws.dataAwsIamPolicyDocument.DataAwsIamPolicyDocument(
        this,
        "ts_lambda_policy",
        {
          statement: [
            {
              actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
              resources: [
                awsCloudwatchLogGroupTsLambdaLoggroup.arn,
                `\${${awsCloudwatchLogGroupTsLambdaLoggroup.arn}}:*`,
              ],
            },
          ],
        }
      );
    const awsApiGatewayDeploymentTsLambda =
      new aws.apiGatewayDeployment.ApiGatewayDeployment(this, "ts_lambda_57", {
        dependsOn:
        //HERE
        [
          cors,
          awsApiGatewayIntegrationTsLambda,
        ],
        restApiId: awsApiGatewayRestApiTsLambda.id,
        stageName: name.value,
      });
    /*This allows the Terraform resource name to match the original name. You can remove the call if you don't need them to match.*/
    awsApiGatewayDeploymentTsLambda.overrideLogicalId("ts_lambda");
    new aws.iamRolePolicy.IamRolePolicy(this, "ts_lambda_role_policy", {
      name: "my-lambda-policy",
      policy: dataAwsIamPolicyDocumentTsLambdaPolicy.json,
      role: awsIamRoleTsLambdaRole.id,
    });
    new cdktf.TerraformOutput(this, "url", {
      value: `\${${mainDomain.value} != "" ? "https://\${${name.value}}.\${${mainDomain.value}}" : "\${${awsApiGatewayDeploymentTsLambda.invokeUrl}}"}`,
    });
  }
}

const app = new App();
new MyStack(app, "cdktf");
app.synth();
