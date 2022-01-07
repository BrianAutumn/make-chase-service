import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";

export const Resolvers = {

    Query: {

    },

    Mutation: {

    },
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Void: () => {
        return null
    }
};