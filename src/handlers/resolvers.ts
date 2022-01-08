import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";
import * as mongoose from "mongoose";
import * as dbschemas from "../dao/DBSchemas";

export const Resolvers = {

    Query: {
        getTurn: async (parent, {game_id}) => {
            return "hider"
        },

        getGame: async (parent, {game_id}) => {
            await dbschemas.initMongo();
            const game = await dbschemas.Game.findOne({'_id': game_id});

            return {
                'game_id': game._id,
                'map_id': game.map_id,
            }
        },

        getMap: async (parent, {game_id}) => {
            return "map"
        },
    },

    Mutation: {
        makeGame: async (parent, {game_type}) => {
            await dbschemas.initMongo();
            const game = new dbschemas.Game({'map_id': 1});
            game.save();

            return game._id;
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