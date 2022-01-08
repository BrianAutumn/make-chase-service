import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";
import * as mongoose from "mongoose";
import * as dbschemas from "../dao/DBSchemas";

export const Resolvers = {

    Query: {
        getTurn: async (parent, {game_id}) => {
            return "hider"
        },

        getGame: async (parent, {game_id}) => {
            return "game"
        },

        getMap: async (parent, {game_id}) => {
            return "map"
        },
    },

    Mutation: {
        makeGame: async (parent, {game_type}) => {
            const game = new dbschemas.Game({'game_id': 0})

            return game.game_id
        },

        joinGame: async (parent, {game_id, role}) => {
            return "hider"
        },

        moveToNode: async (parent, {game_id, node_id}) => {
            return "success"
        },

        burnPath: async (parent, {game_id, path_id}) => {
            return "success"
        },

        endTurn: async (parent, {game_id}) => {
            return "success"
        }
    }
};