import {
  RemovalPolicy,
  Stack as _Stack,
  StackProps,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_certificatemanager,
  aws_route53,
  aws_route53_targets,
  aws_s3_deployment,
} from "aws-cdk-lib";

import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export namespace ReimagineApp {
  export class Stack extends _Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
      super(scope, id, props);

      const bucket = new s3.Bucket(this, "Bucket", {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      });

      const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
        this,
        "Certificate",
        "arn:aws:acm:us-east-1:801215208692:certificate/f1f55c0e-2b32-4aed-aaf2-c33210717861"
      );

      const domainName = "carryoaky.com";

      const distribution = new aws_cloudfront.Distribution(
        this,
        "CloudfrontDistribution",
        {
          defaultBehavior: {
            origin: new aws_cloudfront_origins.S3Origin(bucket),
            viewerProtocolPolicy:
              aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
          domainNames: [domainName],
          defaultRootObject: "index.html",
          certificate,
          errorResponses: [403, 404].map((httpStatus) => ({
            httpStatus,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          })),
        }
      );

      const zone = aws_route53.HostedZone.fromLookup(this, "Zone", {
        domainName: "carryoaky.com",
      });

      const target = aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.CloudFrontTarget(distribution)
      );

      new aws_route53.ARecord(this, "ARecord", { zone, target });
      new aws_route53.ARecord(this, "WWWARecord", {
        zone,
        target,
        recordName: "www",
      });

      new aws_s3_deployment.BucketDeployment(this, "Deploy", {
        memoryLimit: 1024,
        sources: [aws_s3_deployment.Source.asset("../build")],
        destinationBucket: bucket,
        distribution: distribution,
        distributionPaths: ["/*"],
      });
    }
  }
}
