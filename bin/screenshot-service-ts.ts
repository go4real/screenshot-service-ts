#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { ScreenshotServiceTsStack } from '../lib/screenshot-service-ts-stack';

const app = new cdk.App();
new ScreenshotServiceTsStack(app, 'ScreenshotServiceTsStack');
