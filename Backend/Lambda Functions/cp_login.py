import boto3, uuid
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    table_name = 'cp_users'
    email = event['email']
    password = event['password']

    dynamodb = boto3.resource('dynamodb')

    try:
        table = dynamodb.Table('cp_users')
        response = table.scan(
            FilterExpression='email = :email_val',
            ExpressionAttributeValues={':email_val': email}
        )
        items = response['Items']
        print('items:', items)
        if not items:
            return {
                'statusCode': 404,
                'body': 'User not found with the provided email.'
            }
        user = items[0]
        if user['password'] == password:
            token = str(uuid.uuid4())
            response = table.update_item(
                Key={
                    'user_id': user['user_id']
                },
                UpdateExpression=f'SET login_token = :val',
                ExpressionAttributeValues={
                    ':val': token
                },
                ReturnValues='ALL_NEW'  
            )
            print('response after adding token', response.get('Attributes', {}))
            return {
                'statusCode': 200,
                'body': 'Login successful.',  
            }
        else:
            return {
                'statusCode': 401,
                'body': 'Invalid credentials. Login failed.'
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error occurred: {str(e)}'
        }
