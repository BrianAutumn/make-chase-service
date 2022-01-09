import { makeServer } from 'graphql-lambda-subscriptions'
import { makeExecutableSchema } from '@graphql-tools/schema'

import * as path from 'path';
import * as fs from 'fs';
import * as AWS from "aws-sdk";
import {Resolvers} from "./resolvers";
import {Tokens} from "../resources/tokens";

const Schema = fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf-8');

let dynamodb;

if (Tokens.isOffline === 'true') {
  dynamodb = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
} else {
  dynamodb = new AWS.DynamoDB();
}

// define a schema and create a configured DynamoDB instance from aws-sdk
// and make a schema with resolvers (maybe look at) '@graphql-tools/schema

export const subscriptionServer = makeServer({
  dynamodb,
  schema:makeExecutableSchema({
    typeDefs:Schema,
    resolvers:Resolvers
  }),
  tableNames: {
    connections: 'graphql_connections',
    subscriptions: 'graphql_subscriptions',
  }
})

export const handler = subscriptionServer.webSocketHandler