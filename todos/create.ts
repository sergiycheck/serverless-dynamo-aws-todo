"use strict";

import * as uuid from "uuid";

import { DynamoDB } from "aws-sdk";
import { eventLoggerWrapper } from "./event-logger-wrapper";

const dynamoDb = new DynamoDB.DocumentClient();

const createHandler = (event, context, callback) => {
  const timestamp = new Date().getTime();

  const data = event;

  if (typeof data.text !== "string") {
    console.error("Validation Failed");
    callback(new Error("Couldn't create the todo item."));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error("Couldn't create the todo item."));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: params.Item,
    };
    callback(null, response);
  });
};

export const create = eventLoggerWrapper(createHandler);
