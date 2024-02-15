"use strict";

import { DynamoDB } from "aws-sdk";
import { eventLoggerWrapper } from "./event-logger-wrapper";

const dynamoDb = new DynamoDB.DocumentClient();

export const getHandler = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todo item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: result.Item,
    };
    callback(null, response);
  });
};

export const get = eventLoggerWrapper(getHandler);
