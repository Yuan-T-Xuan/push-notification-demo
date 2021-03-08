import boto3
import json
from pywebpush import webpush
from boto3.dynamodb.conditions import Key

dynamo = boto3.resource('dynamodb').Table('user-push-notification')

def push_message(email, title, message_body):
    response_endpoint = dynamo.query(
        KeyConditionExpression=Key('userKey').eq(email)
    )
    if len(response_endpoint['Items']) == 0:
        return
    endpoint = json.loads(response_endpoint['Items'][0]['endpoint'])
    message = {
        "title": title,
        "body": message_body
    }
    webpush(
        subscription_info=endpoint,
        data=json.dumps(message),
        vapid_private_key="s6fRJ2HofafhqmFHutAjvYQSp_HQYDYM8yMfOTpJCGM",
        vapid_claims={"sub": "mailto:spirizon@live.com"}
    )

