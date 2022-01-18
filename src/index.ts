import {
  DynamoDBEventProcessor,
  Server,
} from 'aws-lambda-graphql';
import {connectionManager, subscriptionManager} from "./graphqlResources";
import resolvers from './modules/example/example.resolver'
import {readFileSync} from 'fs';
import {join} from 'path';

const typeDefs = readFileSync(join(__dirname,'./modules/example/example.graphql')).toString();

const server = new Server({
  connectionManager,
  eventProcessor: new DynamoDBEventProcessor(),
  resolvers,
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
