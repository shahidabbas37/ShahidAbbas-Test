import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import * as Joi from 'joi'
import schema from './schema';
import { attendanceSchema } from '../../models/employee.model';



function schemaValidation(message: Joi.ValidationError, statusCode: number) {
  this.message = message;
  this.statusCode = statusCode;
}

const postEmployeeAttendance: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {

 //   console.log(event.body);
    let attendance = event.body;
    if (!event.pathParameters.id || !attendance) {
      return formatJSONResponse({
        message: ` please provide  id, date ,in and out `,
        statuscode: 400

      });
    }
    // validate employee schema before saving
    let validate = await attendanceSchema.validateAsync(attendance);
    if (validate.error) {
      throw new schemaValidation(validate.error, 400);
    }

   // console.log(event.pathParameters.id);
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

    // adding attendance 
    let attendence = await dynamo.update({
      TableName: "employees",
      Key: { id: event.pathParameters.id },
      UpdateExpression:
        "set attendance= :attendance",
      ExpressionAttributeValues: {
        ":attendance": attendance,
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
    return formatJSONResponse({
      message: `attendance has been add`,
      attendence: attendence
    });
  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while adding attendance',
      error: error

    });
  }

}

export const main = middyfy(postEmployeeAttendance);


