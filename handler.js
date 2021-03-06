'use strict';

const AWS = require('aws-sdk');
const getMessage = require('./getMessage');

const options = process.env.LOCAL
  ? { region: 'localhost', endpoint: 'http://localhost:8082' }
  : {};

const dynamo = new AWS.DynamoDB.DocumentClient(options);

const tableName = process.env.tableName;

module.exports.getAll = async () => {
  const params = {
    TableName: tableName,
  };
  console.log({ params });
  try {
    const result = await dynamo.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

// -d '{"queryStringParameters": {"id": "1"}}'
module.exports.query = async event => {
  console.log({ event });
  const { id } = event.queryStringParameters;
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id },
  };
  console.log({ params });
  try {
    const result = await dynamo.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

// -d '{"pathParameters": {"id": "1"}}'
module.exports.get = async event => {
  console.log({ event });
  const { id } = event.pathParameters;
  const params = {
    TableName: tableName,
    Key: { id },
  };
  console.log({ params });
  try {
    const result = await dynamo.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

// -d '{"body": {"message": "Hello"}}'
module.exports.put = async event => {
  const id = String(Date.now());
  const { message } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Item: { id, message },
  };

  console.log({ params });

  try {
    await dynamo.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ id, message }),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

module.exports.hello = async event => {
  const message = getMessage(event);
  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
};
