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
        let cookie = context?.event?.headers?.Cookie || context?.event?.headers?.cookie
        let session = cookie.match(/(?<=session=).*?(?=$| |;)/g)[0]
        if (!session) {
          throw new AuthenticationError(`No Session`)
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
  plugins: [{
    requestDidStart(){
      return {
        willSendResponse(requestContext) {
          const { authToken } = requestContext.context;
          if(authToken){
            requestContext.response.http.headers.set("Set-Cookie", `session=${authToken}; Secure; HttpOnly`);
            requestContext.response.http.headers.set("Cache-Control", `no-cache="Set-Cookie"`);
          }
          return requestContext;
        }
      };
    }
  }],
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
      context
    };
  },
  subscriptions: {
    onConnect(messagePayload, connection, event, context:any) {
      let currentUser;
      if (messagePayload.authToken && messagePayload.authToken !== 'undefined') {
        try {
          currentUser = decrypt(messagePayload.authToken)
        } catch (e) {
          throw new AuthenticationError('Session Invalid')
        }
      }
      context.currentUser = currentUser;
      return {currentUser};
    }
  }
});

export const handleHttp = server.createHttpHandler();
export const handleWebSocket = server.createWebSocketHandler();
export const handleDynamoDBStream = server.createEventHandler();

connect()