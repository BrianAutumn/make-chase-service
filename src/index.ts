import {
  DynamoDBEventProcessor,
  Server,
} from 'aws-lambda-graphql';
import {connectionManager, subscriptionManager} from "./graphqlResources";
import rawResolvers from './resolvers';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import {join} from 'path';
import {connect} from "./mongooseManager";
import HttpHeadersPlugin from 'apollo-server-plugin-http-headers';

const typesArray = loadFilesSync(join(__dirname, './modules'), { recursive: true })
const typeDefs = mergeTypeDefs(typesArray)

const server = new Server({
  connectionManager,
  eventProcessor: new DynamoDBEventProcessor(),
  resolvers:mergeResolvers(rawResolvers) as any,
  plugins:[HttpHeadersPlugin],
  subscriptionManager,
  // use serverless-offline endpoint in offline mode
  ...(process.env.IS_OFFLINE
    ? {
        playground: {
          subscriptionEndpoint: 'ws://localhost:3001',
        },
      }
    : {playground: true}),
  typeDefs,
  introspection:true,
  context: ({ event, context }) => {
    return {
      event,
      context,
      setCookies: [],
      setHeaders: []
    };
  }
});

export const handleHttp = server.createHttpHandler();
export const handleWebSocket = server.createWebSocketHandler();
export const handleDynamoDBStream = server.createEventHandler();

connect()