import {
  DynamoDBEventProcessor,
  Server,
} from 'aws-lambda-graphql';
import {connectionManager, subscriptionManager} from "./graphqlResources";
import rawResolvers from './resolvers';
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')
import {join} from 'path';

const typesArray = loadFilesSync(join(__dirname, './modules'), { recursive: true })
const typeDefs = mergeTypeDefs(typesArray)

const server = new Server({
  connectionManager,
  eventProcessor: new DynamoDBEventProcessor(),
  resolvers:mergeResolvers(rawResolvers),
  subscriptionManager,
  // use serverless-offline endpoint in offline mode
  ...(process.env.IS_OFFLINE
    ? {
        playground: {
          subscriptionEndpoint: 'ws://localhost:3001',
        },
      }
    : {}),
  typeDefs,
});

export const handleHttp = server.createHttpHandler();
export const handleWebSocket = server.createWebSocketHandler();
export const handleDynamoDBStream = server.createEventHandler();
