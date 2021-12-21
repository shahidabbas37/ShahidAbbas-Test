import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import * as Joi from 'joi'
import schema from './schema';
import { payrollSchema } from '../../models/employee.model';


function schemaValidation(message: Joi.ValidationError, statusCode: number) {
  this.message = message;
  this.statusCode = statusCode;
}

const postUpdatePayroll: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {


    let payroll = event.body;
    if (!event.pathParameters.id || !payroll) {
      return formatJSONResponse({
        message: ` please provide  id and payroll attributes `,
        statuscode: 400

      });
    }
    // validate payroll schema before saving
    let validate = await payrollSchema.validateAsync(payroll);
    if (validate.error) {
      throw new schemaValidation(validate.error, 400);
    }

  //  console.log(event.pathParameters.id);
    // check if employee already exist with id 
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

    // adding/updating payroll 
  let Payroll =  await dynamo.update({
      TableName: "employees",
      Key: { id: event.pathParameters.id },
      UpdateExpression:
        "set payroll= :payroll",
      ExpressionAttributeValues: {
        ":payroll": payroll,
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
    return formatJSONResponse({
      message: `payroll has been add`,
      payroll:Payroll
    });
  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while adding payroll',
      error: error
     

    });
  }

}

export const main = middyfy(postUpdatePayroll);


