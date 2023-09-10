import boto3, uuid
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    user_id = event['user_id']

    try:
        table = dynamodb.Table('cp_users')
        response = table.update_item(
            Key={
                'user_id': user_id
            },
            UpdateExpression=f'SET login_token = :val',
            ExpressionAttributeValues={
                ':val': ''
            },
        )
        return {
            'statusCode': 200,
            'body': 'Logout successful.',
            
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error occurred: {str(e)}'
        }
