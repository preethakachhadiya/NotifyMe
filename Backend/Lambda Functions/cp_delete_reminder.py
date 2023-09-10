import json, boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    try:
        table = dynamodb.Table('cp_users')
        response = table.scan(
            FilterExpression='email = :email_val',
            ExpressionAttributeValues={':email_val': event['email']}
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
        
# -------------------------------------------------------------------------------
    table = dynamodb.Table('cp_reminders')
    
    reminder_id = event['reminder_id']
    response = table.delete_item(
        Key={
            'reminder_id': reminder_id
        }
    )
    
    return {
        'statusCode': 200,
        'body': 'Reminder deleted successfully'
    }
