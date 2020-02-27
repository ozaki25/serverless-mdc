'use strict';

const getMessage = require('./getMessage');

module.exports.hello = async (event, context, callback) => {
  const message = getMessage(event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
  return callback(null, response);
};
