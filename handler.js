'use strict';

const AWS = require('aws-sdk');

const options = process.env.LOCAL
  ? {
      region: 'localhost',
      endpoint: 'http://localhost:8081',
    }
  : {};

const dynamo = new AWS.DynamoDB.DocumentClient(options);

const tableName = 'sls-sample-dev-hello';

module.exports.hello = async event => {
  const params = {
    TableName: tableName,
    Item: { id: String(Date.now()), message: event },
  };

  try {
    dynamo.put(params, (error, data) => {
      if (error) throw new Error(error.stack);
      console.log({ data });
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    });
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.toString() }),
    };
  }
};
