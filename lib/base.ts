import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as s3 from '@aws-cdk/aws-s3';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sqs from '@aws-cdk/aws-sqs';

export class BaseStack extends cdk.Stack {
    vpc: ec2.Vpc;
    cluster: ecs.Cluster;
    bucket: s3.Bucket;
    table: dynamodb.Table;
    queue: sqs.Queue;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Network
        this.vpc = new ec2.Vpc(this, 'vpc', {
            maxAzs: 2,
            natGateways: 1
        });

        // ECS cluster
        this.cluster = new ecs.Cluster(this, 'cluster', {
            vpc: this.vpc
        });

        // S3
        this.bucket = new s3.Bucket(this, 'bucket', {
            publicReadAccess: true
        })

        // SQS
        this.queue = new sqs.Queue(this, 'queue');

        // DynamoDB
        this.table = new dynamodb.Table(this, 'table', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });
    }
}
