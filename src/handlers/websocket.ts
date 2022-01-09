import { makeServer } from 'graphql-lambda-subscriptions'
import { makeExecutableSchema } from '@graphql-tools/schema'

import * as path from 'path';
import * as fs from 'fs';
import * as AWS from "aws-sdk";
import {Resolvers} from "./resolvers";

const Schema = fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf-8');

// define a schema and create a configured DynamoDB instance from aws-sdk
// and make a schema with resolvers (maybe look at) '@graphql-tools/schema

export const subscriptionServer = makeServer({
  dynamodb: new AWS.DynamoDB(),
  schema:makeExecutableSchema({
    typeDefs:Schema,
    resolvers:Resolvers
  }),
})

export const handler = subscriptionServer.webSocketHandler