import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";

export const Resolvers = {

    Query: {
        example: async (parent, {name}) => {
           return {
               name,
               time:Date.now()
           }
        },
    },
};