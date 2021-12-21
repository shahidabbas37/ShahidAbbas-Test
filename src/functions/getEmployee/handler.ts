import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import schema from './schema';


const getEmployee: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {

    if (!event.pathParameters || !event.pathParameters.id) {
      return formatJSONResponse({
        message: ` please provide  id for geting  employee`,
        statuscode: 400

      });
    }
    //  console.log(event.pathParameters.id);
    // getting employee
    let Employee = await dynamo.get({
      TableName: "employees",
      Key: { id: event.pathParameters.id }
    }).promise();
    console.log(Employee);
    if (!Employee.Item) {
      return formatJSONResponse({
        message: ` no employee already exist with this  id`,
        statuscode: 400

      });
    }

    return formatJSONResponse({
      message: `employee with this id is  `,
      employee: Employee

    });
  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while getting employee',
      error: error

    });
  }

}

export const main = middyfy(getEmployee);


