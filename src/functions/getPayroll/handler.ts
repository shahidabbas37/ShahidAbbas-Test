import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import schema from './schema';


const getEmpPayroll: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {

    if (!event.pathParameters.id || !event.pathParameters) {
      return formatJSONResponse({
        message: ` please provide  id `,
        statuscode: 400

      });
    }

    let Employee = await dynamo.get({
      TableName: "employees",
      Key: { id: event.pathParameters.id }
    }).promise();
    // console.log(Employee);
    if (!Employee.Item) {
      return formatJSONResponse({
        message: ` no employee already exist with this  id`,
        statuscode: 400

      });
    }

    return formatJSONResponse({
      message: `Employee payroll`,
      payroll: Employee.Item.payroll
    });
  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while adding 	payroll',
      error: error

    });
  }

}

export const main = middyfy(getEmpPayroll);


