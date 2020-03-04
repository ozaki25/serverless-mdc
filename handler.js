'use strict';

const AWS = require('aws-sdk');

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
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

module.exports.get = async event => {
  console.log({ event });
  const { id } = event;
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
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

module.exports.put = async event => {
  const params = {
    TableName: tableName,
    Item: { id: String(Date.now()), message: event },
  };

  console.log({ params });

  try {
    const result = await dynamo.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
  return {
    statusCode: 200,
    body: JSON.stringify({ message: event }),
  };
};
