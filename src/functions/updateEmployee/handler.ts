import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import * as Joi from 'joi'
import schema from './schema';
import { updateEmployeeSchema } from '../../models/employee.model';



function schemaValidation(message: Joi.ValidationError, statusCode: number) {
  this.message = message;
  this.statusCode = statusCode;
}
const updateEmployee: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {

    // validate if body is not empty
    let employee = event.body;
    if (!employee || !event.pathParameters.id) {
      return formatJSONResponse({
        message: ` please provide all attribute of employee and id`,
        statuscode: 400

      });
    }

    // validate employee schema before saving
    let validate = await updateEmployeeSchema.validateAsync(employee);
    if (validate.error) {
      throw new schemaValidation(validate.error, 400);
    }

    // check if employee  exist with id 
    let Employee = await dynamo.get({
      TableName: "employees",
      Key: { id: event.pathParameters.id }
    }).promise();
    if (!Employee.Item) {
      return formatJSONResponse({
        message: ` no employee  exist with this id`,
        statuscode: 400

      });
    }
    // updating if employee exist

    let Emp = await dynamo.update({
      TableName: "employees",
      Key: { id: event.pathParameters.id },
      UpdateExpression:
        "set fullName= :fullName, dateOfBirth= :dateOfBirth, address= :address, #status= :status, phone= :phone, email= :email ",
      ExpressionAttributeValues: {
        ":fullName": employee.fullName || Employee.Item.fullName,
        ":dateOfBirth": employee.dateOfBirth || Employee.Item.dateOfBirth,
        ":address": employee.address || Employee.Item.address,
        ":status": employee.status || Employee.Item.status,
        ":phone": employee.phone || Employee.Item.phone,
        ":email": employee.email || Employee.Item.email,


      },
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
    return formatJSONResponse({
      message: `employee has been updated`,
      Employee: Emp
    });
  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while updating employee',
      error: error

    });
  }

}

export const main = middyfy(updateEmployee);


