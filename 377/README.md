# MediaLive Channel Controller

## Overview

This is a solution designed for companies or individuals that have a need to do accurate source switching on their live event channels. The full-features MediaLive Scheduling API/SDK makes this possible. Other core AWS services have been used to create a very robust and lightweight solution.

## Architecture

![](images/workflow-with-lowlatency-preview-arc.png?width=60pc&classes=border,shadow)

This solution has been designed to deploy around an existing video pipeline. The architecture drawing shows a fully redundant video pipeline that utilizes the MediaLive Controller solution to enrich the live stream experience.

If you are wanting to deploy an entire solution from scratch, here are the steps:

1. Deploy your video pipeline.. This readme doesn't contain instructions for that. Check out [this blog post](https://aws.amazon.com/blogs/media/awse-quickly-creat-live-streaming-channel-aws-elemental-medialive-workflow-wizard/) that features the *Workflow Wizard*, a Media Services tool used to deploy all required components

2. Deploy the *MediaLive Controller* solution, by using the CloudFormation template provided below. The services used include Amazon CloudFront, Amazon S3, Amazon API Gateway, AWS Lambda

3. Deploy a couple of EC2 instances to act as *low latency streamers* for the MediaLive Controller solution

4. Configure your MediaLive channels to send proxy streams to the EC2 instances

5. Configure CloudFront to serve the low latency stream from your EC2 instances, an origin group is recommended

6. Add AWS WAF as a layer of security

## How To Deploy
### Deploy your video pipeline
As mentioned above, this guide doesn't contain instructions for that. Go to the blog post mentioned for easy deployment, or pick an existing video pipeline to add this solution to

### Deploy the MediaLive Controller
This solution is deployed via CloudFormation, it utilizes the following services:
- AWS IAM
- AWS Lambda
- Amazon API Gateway
- Amazon CloudFront
- Amazon S3

