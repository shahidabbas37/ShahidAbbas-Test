import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from "aws-sdk";
import * as Joi from 'joi'
import schema from './schema';
import { employeeSchema } from '../../models/employee.model';
import { v4 as uuidv4 } from 'uuid';


function schemaValidation(message: Joi.ValidationError, statusCode: number) {
  this.message = message;
  this.statusCode = statusCode;
}


const addEmployee: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'lccalhost',
    endpoint: "http://localhost:8000",
  });

  try {
    // validate if body is  empty
    const employee = event.body;
    if (!employee) {
      return formatJSONResponse({
        message: ` please provide all attributes of employee`,
        statuscode: 400

      });
    }

    // validate employee schema before saving
    let validate = await employeeSchema.validateAsync(employee);
    if (validate.error) {
      throw new schemaValidation(validate.error, 400);
    }

    // saving to db
    await dynamo.put({
      TableName: "employees",
      Item: { ...event.body, id: uuidv4() }
    }, function (err) {
      if (err) {
        return formatJSONResponse({
          message: 'some error occured while adding employee',
          error: err
        })
      }
    }).promise();

    return formatJSONResponse({
      message: `employee has been created`,
      employee: event.body,


    });
  } catch (error) {
    return formatJSONResponse({
      message: 'some error occured while adding employee',
      error: error

    });
  }

}

export const main = middyfy(addEmployee);


