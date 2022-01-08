import {ApolloServer} from 'apollo-server-lambda';
import {Schema} from "./schema";
import {Resolvers} from "./resolvers";
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";

const server = new ApolloServer({
    typeDefs: Schema,
    resolvers: Resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
});


export const handler = server.createHandler();