import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as s3 from '@aws-cdk/aws-s3';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sqs from '@aws-cdk/aws-sqs';

export interface WorkerProps extends cdk.StackProps {
    readonly bucket: s3.Bucket;
    readonly queue: sqs.Queue;
    readonly table: dynamodb.Table;
    readonly cluster: ecs.Cluster;
}

export class WorkerStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: WorkerProps) {
        super(scope, id, props);    

        // Worker
        const workerDefinition = new ecs.FargateTaskDefinition(this, 'worker-definition', {
            cpu: 2048,
            memoryLimitMiB: 4096
        });
  
        const container = workerDefinition.addContainer('worker', {
            image: ecs.ContainerImage.fromAsset('./worker'),
            cpu: 2048,
            memoryLimitMiB: 4096,
            environment: {
            QUEUE_URL: props.queue.queueUrl,
            TABLE: props.table.tableName,
            BUCKET: props.bucket.bucketName
            },
            logging: new ecs.AwsLogDriver({
            streamPrefix: 'worker'
            })
        });
    
        const worker = new ecs.FargateService(this, 'worker', {
            cluster: props.cluster,
            desiredCount: 1,
            taskDefinition: workerDefinition
        });
    
        props.queue.grantConsumeMessages(workerDefinition.taskRole);
        props.table.grantReadWriteData(workerDefinition.taskRole);
        props.bucket.grantReadWrite(workerDefinition.taskRole);
    }
  }