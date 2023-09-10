import json, boto3, uuid

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

    table1 = dynamodb.Table('cp_reminders')
    event_id = event['event_id']
    response = table1.scan(
        FilterExpression=f'event_id = :attr_value',
        ExpressionAttributeValues={':attr_value': event_id}
    )
    print('reminders list', response.get('Items', []))
    for item in response.get('Items', []):
        table1.delete_item(
            Key={
                'reminder_id': item['reminder_id']
            }
        )

# -------------------------------------------------------------------------------
    table2 = dynamodb.Table('cp_events')
    response = table2.delete_item(
        Key={
            'event_id': event_id
        }
    )
    
    return {
        'statusCode': 200,
        'body': 'Reminder deleted successfully'
    }
