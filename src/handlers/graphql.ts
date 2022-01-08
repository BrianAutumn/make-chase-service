import {ApolloServer} from 'apollo-server-lambda';
import {Schema} from "./schema";
import {Resolvers} from "./resolvers";
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import {ApolloLogPlugin} from "apollo-log";

const loggingOptions = {
  events: {
    didEncounterErrors: true,
    didResolveOperation: true,
    executionDidStart: true,
    parsingDidStart: true,
    responseForOperation: true,
    validationDidStart: true,
    willSendResponse: true
  },
  timestamp:true
}

const server = new ApolloServer({
  typeDefs: Schema,
  resolvers: Resolvers,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
    ApolloLogPlugin(loggingOptions) as any
  ]
});


export const handler = server.createHandler();