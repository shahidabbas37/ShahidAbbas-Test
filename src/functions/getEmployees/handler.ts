import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import schema from './schema';


const getEmployees: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {

    let Employees = await dynamo.scan({
      TableName: "employees"
    }).promise();

    if (Employees.Items.length === 0) {
      return formatJSONResponse({
        message: ` no employee  exist`,
        statuscode: 400

      });
    }

    return formatJSONResponse({
      message: `All employees `,
      employees: Employees

    });
  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while getting employees',
      error: error

    });
  }

}

export const main = middyfy(getEmployees);


