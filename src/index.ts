import {
  DynamoDBEventProcessor,
  Server,
} from 'aws-lambda-graphql';
import {connectionManager, subscriptionManager} from "./graphqlResources";
import rawResolvers from './resolvers';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge'
import {loadFilesSync} from '@graphql-tools/load-files'
import {join} from 'path';
import {connect} from "./mongooseManager";
import HttpHeadersPlugin from 'apollo-server-plugin-http-headers';
import {gql} from 'apollo-server'
import {makeExecutableSchema} from "@graphql-tools/schema";
import {getDirective, MapperKind, mapSchema} from '@graphql-tools/utils'
import {defaultFieldResolver} from "graphql";
import {AuthenticationError} from "apollo-server-errors";
import {decrypt} from "./utils/crypto.util";

const typesArray = loadFilesSync(join(__dirname, './modules'), {recursive: true})
typesArray.push(gql`directive @auth on FIELD_DEFINITION`)
const typeDefs = mergeTypeDefs(typesArray)

let schema = makeExecutableSchema({typeDefs, resolvers: mergeResolvers(rawResolvers)})

//Auth Directive
schema = mapSchema(schema, {
  [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
    const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
    if (authDirective) {
      const {resolve = defaultFieldResolver} = fieldConfig;
      fieldConfig.resolve = async function (source, args, context, info) {
        let session = context?.event?.headers?.cookie?.match(/(?<=session=).*?(?=$| |;)/g)[0]
        if (!session) {
          throw new AuthenticationError('No Session')
        }
        let user;
        try {
          user = JSON.parse(decrypt(decodeURIComponent(session)))
        } catch (e) {
          throw new AuthenticationError('Session Invalid')
        }
        context.currentUser = user;
        return await resolve(source, args, context, info);
      }
      return fieldConfig;
    }
  }
});

const server = new Server({
  connectionManager,
  eventProcessor: new DynamoDBEventProcessor(),
  schema,
  plugins: [HttpHeadersPlugin],
  subscriptionManager,
  // use serverless-offline endpoint in offline mode
  ...(process.env.IS_OFFLINE
    ? {
      playground: {
        subscriptionEndpoint: 'ws://localhost:3001',
      },
    }
    : {playground: true}),
  introspection: true,
  context: ({event, context}) => {
    return {
      event,
      context,
      setCookies: [],
      setHeaders: []
    };
  },
  subscriptions: {
    onConnect(messagePayload, connection, event, context) {
      let currentUser;
      if (messagePayload.authToken) {
        try {
          currentUser = decrypt(messagePayload.authToken)
        } catch (e) {
          throw new AuthenticationError('Session Invalid')
        }
      }
      return {currentUser};
    }
  }
});

export const handleHttp = server.createHttpHandler();
export const handleWebSocket = server.createWebSocketHandler();
export const handleDynamoDBStream = server.createEventHandler();

connect()