import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import schema from './schema';


const deleteEmployee: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {
    if (!event.pathParameters || !event.pathParameters.id) {
      return formatJSONResponse({
        message: ` please provide  id for deleting  employee`,
        statuscode: 400

      });
    }

    const params = {
      Key: {
        id: event.pathParameters.id
      },
      ReturnValues: 'ALL_OLD',
      TableName: 'employees'
    };
    let result = await dynamo.delete(params).promise();
    console.log(result);
    if (!result.Attributes) {
     // throw new Error('no item with this id')
      return formatJSONResponse({
        message: `no employee exists with this id`,
        statuscode: 404

      });
    }
    return formatJSONResponse({
      message: `employee has been deleted`,
      employee: result
    });
  

  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while deleting employee',
      error: error

    });
  }

}

export const main = middyfy(deleteEmployee);


