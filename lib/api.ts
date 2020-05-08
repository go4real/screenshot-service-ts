import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as sqs from '@aws-cdk/aws-sqs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';

export interface ApiProps extends cdk.StackProps {
    readonly queue: sqs.Queue;
    readonly table: dynamodb.Table;
    readonly cluster: ecs.Cluster;
}

export class ApiStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: ApiProps) {
        super(scope, id, props);    

        // API
        const api = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'api', {
            cluster: props.cluster,
            taskImageOptions: {
            image: ecs.ContainerImage.fromAsset('./api'),
            enableLogging: true,
            environment: {
                QUEUE_URL: props.queue.queueUrl,
                TABLE: props.table.tableName
            }
            },
            desiredCount: 2,
            cpu: 512,
            memoryLimitMiB: 1024,
            publicLoadBalancer: true
        });
    
        props.queue.grantSendMessages(api.taskDefinition.taskRole);
        props.table.grantReadWriteData(api.taskDefinition.taskRole);
    }
  }