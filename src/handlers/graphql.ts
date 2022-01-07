import {ApolloServer} from 'apollo-server-lambda';
import {Schema} from "./schema";
import {Resolvers} from "./resolvers";

const server = new ApolloServer({
    typeDefs: Schema,
    resolvers: Resolvers,

    playground: true,
    introspection: true,
});

const graphqlHandler = server.createHandler();

export function handler() {
    return graphqlHandler(...arguments);
}

