import type { AWS } from '@serverless/typescript';

import addEmployee from '@functions/addEmployee';
import getEmployee from '@functions/getEmployee';
import getEmployees from '@functions/getEmployees';
import deleteEmployee from '@functions/deleteEmployee';
import updateEmployee from '@functions/updateEmployee';
import postEmployeeAttendance from '@functions/attendence';
import getEmpAttendance from '@functions/getEmpAttendance';
import postUpdatePayroll from '@functions/Payroll';
import getEmpPayroll from '@functions/getPayroll';



const serverlessConfiguration: AWS = {
  service: 'ShahidAbbasTest',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild',
    "serverless-offline",
    "serverless-dynamodb-local",],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths

  functions: {
    addEmployee, getEmployee, getEmployees,
    deleteEmployee, updateEmployee, postEmployeeAttendance,
    getEmpAttendance, postUpdatePayroll, getEmpPayroll
  },
  package: { individually: true },
  custom: {
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        migrate: true,
        seed: true,
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {


      mydynamoTable: {
        Type: "AWS::DynamoDB::Table",

        Properties: {
          TableName: "employees",

          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],

          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],

          ProvisionedThroughput:
          {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        },

      },


    },

  },

};

module.exports = serverlessConfiguration;
