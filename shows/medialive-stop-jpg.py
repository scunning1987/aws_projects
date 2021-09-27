'''
Original Author: Scott Cunningham
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
'''
import json
import boto3
import os
import time

def lambda_handler(event, context):
    print("INFO: Event info - ",event)

    region = event['region']

    #eml client
    client = boto3.client('medialive', region_name=region)
    # boto3 S3 initialization
    s3_client = boto3.client("s3")


    event_state = event['detail']['state']
    jpg_bucket = os.environ['PLACEHOLDER_JPG_BUCKET']
    jpg_key = os.environ['PLACEHOLDER_JPG_KEY']

    s3_destination = ""

    ## FUNCTION BLOCK START

    def describe_channel(channelid):
        try:
            response = client.describe_channel(
                ChannelId=channelid
            )
            #print(json.dumps(response))
        except Exception as e:
            print(e)
        return response['Destinations']

    ## FUNCTION BLOCK END

    try:
        channelid = event['detail']['channel_arn'].split(":")[-1]
        medialive_destinations = describe_channel(channelid)
    except:
        return {
            'statusCode': 200,
            'body': 'Error Getting MediaLive Channel information for channel id ' + channelid
        }


    for destination in medialive_destinations:
        if len(destination['Settings']) > 0: ## probably S3 output
            if "s3" in destination['Settings'][0]['Url']:
                s3_destination = destination['Settings'][0]['Url']



    #return os.path.dirname(s3_destination)
    bucket_name = s3_destination.replace("s3://","").rsplit("/")[0]
    new_key_name = s3_destination.replace("s3://","").replace(bucket_name+"/","") + ".jpg"

    print("INFO : Channel ID %s in %s State. Copying default slate %s to channel output %s" % (channelid,event_state,jpg_key,new_key_name))

    # Copy Source Object
    copy_source_object = {'Bucket': jpg_bucket, 'Key': jpg_key}

    try:
        # S3 copy object operation
        response = s3_client.copy_object(CopySource=copy_source_object, Bucket=bucket_name, Key=new_key_name)
    except:
        return {
            'statusCode': 200,
            'body': 'Error copying slate jpg to MediaLive configured S3 destination, channel ' + channelid
        }

    return {
        'statusCode': 200,
        'body': str(response)
    }
