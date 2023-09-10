import boto3
import datetime

def is_today(iso_date_string):
    datetime_obj = datetime.datetime.fromisoformat(iso_date_string)
    today_date = datetime.datetime.now().date()
    return datetime_obj.date() == today_date

def lambda_handler(event, context):
    table_name = 'cp_reminders'
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)
    response = table.scan()
    items = response['Items']
    filtered_items = [item for item in items if is_today(item['date'])]
    table2 = dynamodb.Table('cp_events')
    print('table2', table2.key_schema)
    key_attribute = 'event_id'
    
    sns_client = boto3.client('sns', region_name='us-east-1')
    
    for reminder in filtered_items:
        print('reminder', reminder)
        event_id = reminder.get('event_id')
        print(event_id)
        try:
            response = table2.get_item(
                Key={'event_id': event_id}
            )
            item = response.get('Item')
            print('event name:', item)
            reminder['event_name'] = item.get('name')
            
        except Exception as e:
            return {
                'statusCode': 500,
                'body': f'Error occurred: {str(e)}'
            }
            
        event_name = reminder.get('event_name')
        date = reminder.get('date')
        message = reminder.get('message')
        email = reminder.get('email')
        
        message_attributes = {
            'email': {
                'DataType': 'String',
                'StringValue': email
            }
        }
        email_message = f'This is reminder notification set by you. \n\n Event: {event_name}, {date[0:10]} \n Message: {message}'
        response = sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:877341190502:cloud_project_send_email_notification',
            Message=email_message,
            Subject='Reminder for event: ' + event_name,
            MessageAttributes=message_attributes
        )
        response = table.delete_item(
            Key={
                'reminder_id': reminder.get('reminder_id')
            }
        )
    print("Items for today's date:", filtered_items)
