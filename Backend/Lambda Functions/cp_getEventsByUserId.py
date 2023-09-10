import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    try:
        table = dynamodb.Table('cp_users')
        response = table.scan(
            FilterExpression='user_id = :id_val',
            ExpressionAttributeValues={':id_val': event['user_id']}
        )
        items = response['Items']
        print('items:', items)
        if not items:
            return {
                'statusCode': 404,
                'body': 'User not found with the provided email.'
            }
        user = items[0]
        if not user['login_token']:
            return {
                'statusCode': 400,
                'body': 'User not logged in.'
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error occurred: {str(e)}'
        }
        
# ----------------------------------------------------------------------------------------------

    userid = event['user_id']  
    try:
        table = dynamodb.Table('cp_events')
        response = table.scan(
            FilterExpression="user_id = :id",
            ExpressionAttributeValues={":id": userid}
        )
        items = response.get('Items', [])
        print(items)
        return {
            'statusCode': 200,
            'body': items
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error occurred: {str(e)}'
        }
