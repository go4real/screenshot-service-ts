#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { BaseStack } from '../lib/base';
import { WorkerStack } from '../lib/worker';
import { ApiStack } from '../lib/api';

class App extends cdk.App {
    constructor() {
        super();
        const baseStack = new BaseStack(this, 'ScreenshotServiceBase', {});

        const apiStack = new ApiStack(this, 'ScreenshotServiceApi', {
            queue: baseStack.queue,
            table: baseStack.table,
            cluster: baseStack.cluster
        });

        const workerStack = new WorkerStack(this, 'ScreenshotServiceWorker', {
            bucket: baseStack.bucket,
            queue: baseStack.queue,
            table: baseStack.table,
            cluster: baseStack.cluster
        });
    }
}

const app = new App();
