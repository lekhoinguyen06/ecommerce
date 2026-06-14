import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
// import * as awsx from '@pulumi/awsx';

const bucket = new aws.s3.Bucket('ecommerce-bucket');
const bucketPAB = new aws.s3.BucketPublicAccessBlock('ecommerce-bucket', {
  bucket: bucket.id,
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
});

const allowPublicReadGetObject = aws.iam.getPolicyDocumentOutput({
  statements: [
    {
      sid: 'PublicReadGetObject',
      effect: 'Allow',
      principals: [{ type: '*', identifiers: ['*'] }],
      actions: ['s3:GetObject'],
      resources: [pulumi.interpolate`${bucket.arn}/*`],
    },
  ],
});

const allowPublicReadGetObjectPolicy = new aws.s3.BucketPolicy(
  'allow-public-read-get-object',
  {
    bucket: bucket.id,
    policy: allowPublicReadGetObject.json,
  },
);

export const bucketName = bucket.id;
