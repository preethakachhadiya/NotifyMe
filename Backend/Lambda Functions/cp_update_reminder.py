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
    table = dynamodb.Table('cp_reminders')
    reminder_id = event['reminder_id']
    new_message = event['message']
    new_date = event['date']
    response = table.update_item(
        Key={
            'reminder_id': reminder_id
        },
        UpdateExpression='SET message = :new_msg, #dt = :new_date',
        ExpressionAttributeNames={
                '#dt': 'date'
            },
        ExpressionAttributeValues={
            ':new_msg': new_message,
            ':new_date': new_date
        },
        ReturnValues='UPDATED_NEW'  
    )
    
    return {
        'statusCode': 200,
        'body': 'Reminder updated successfully'
    }
