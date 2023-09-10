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
    record = event
    record['reminder_id'] = str(uuid.uuid4())
    table = dynamodb.Table('cp_reminders')
    table.put_item(
        Item=record
    )

    return {
        'statusCode': 200,
        'body': 'New reminder created successfully'
    }
