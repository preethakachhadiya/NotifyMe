import boto3
import uuid, json

def lambda_handler(event, context):
    table_name = 'cp_users'
    dynamodb = boto3.resource('dynamodb')

    try:
        user_id = str(uuid.uuid4())
        record = event
        record['user_id'] = user_id
        record['token'] = ''

        table = dynamodb.Table(table_name)
        response = table.scan(
            FilterExpression='email = :email_val',
            ExpressionAttributeValues={':email_val': record['email']}
        )
        items = response['Items']
        if not items:         
            table.put_item(
                Item=record
            )
            attributes = {
                            'email': [record['email']]
                        }
            sns_client = boto3.client('sns', region_name='us-east-1')
            response = sns_client.subscribe(
                TopicArn='arn:aws:sns:us-east-1:877341190502:cloud_project_send_email_notification',
                Protocol='email',
                Endpoint= record['email'],
                Attributes={
                    'FilterPolicy': json.dumps(attributes)
                }
            )
            return {
                'statusCode': 200,
                'body': f'Record added successfully with user_id: {user_id}'
            }
        else:
            return {
                'statusCode': 400,
                'body': f'Email already in use. Please use another email.'
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error occurred: {str(e)}'
        }
