import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";

export const Resolvers = {

    Query: {
        example: async (parent, {name,phrase}) => {
           return {
               name,
               phrase,
               time:Date.now()
           }
        },
    },
};