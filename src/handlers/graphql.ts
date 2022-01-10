import {
  DynamoDBConnectionManager,
  DynamoDBEventProcessor,
  DynamoDBSubscriptionManager,
  Server,
} from 'aws-lambda-graphql';
import * as path from 'path';
import * as fs from 'fs';
import {pubSub, Resolvers} from "./resolvers";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";

const Schema = fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf-8');

const eventProcessor = new DynamoDBEventProcessor();
const subscriptionManager = new DynamoDBSubscriptionManager();
const connectionManager = new DynamoDBConnectionManager({
  subscriptions: subscriptionManager,
});

const typeDefs = Schema;

const resolvers = Resolvers;

const server = new Server({
  // accepts all the apollo-server-lambda options and adds few extra options
  // provided by this package
  context: {
    pubSub,
  },
  connectionManager,
  eventProcessor,
  resolvers,
  subscriptionManager,
  typeDefs,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground() as any
  ]
});

export const handleWebSocket = server.createWebSocketHandler();
export const handleHTTP = server.createHttpHandler();
// this creates dynamodb event handler so we can send messages to subscribed clients
export const handleEvents = server.createEventHandler();