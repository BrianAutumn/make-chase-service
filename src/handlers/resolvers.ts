import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";
import * as mongoose from "mongoose";
import * as dbschemas from "../dao/DBSchemas";

export const Resolvers = {

    Query: {
        getTurn: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            return "hider"
        },

        getGame: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);

            return {
                'game_id': game._id,
                'map_id': game.map_id,
                'hider_id': game.hider_id,
                'seeker_id': game.seeker_id,
            }
        },

        getMap: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            return "map"
        },
    },

    Mutation: {
        makeGame: async (parent, {game_type}) => {
            await dbschemas.initMongo();

            const new_game = new dbschemas.Game({'turn': 'hider', 'game_started': false});
            new_game.save();

            return new_game._id;
        },

        joinGame: async (parent, {game_id, role}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);

            if (role == 'seeker' && game.seeker_id != null) {
                throw "Seeker has already joined the game.";
            }
            if (role == 'hider' && game.hider_id != null) {
                throw "Hider has already joined the game.";
            }

            const player = new dbschemas.Player({'role': role})

            if (role == 'hider') {
                game.hider_id = player._id;
            }
            if (role == 'seeker') {
                game.seeker_id = player._id;
            }

            game.save();
            player.save();

            return player.role;
        },

        startGame: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);

            if (game.hider_id == null || game.seeker_id == null) {
                throw "Not enough players to start the game.";
            }

            // we should generate map right about now

            game.started = true;

            game.save();

            return "success";
        },

        moveToNode: async (parent, {game_id, node_id, role}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);
            if (game.started == false) {throw "Game has not started yet."}

            return "success"
        },

        burnPath: async (parent, {game_id, path_id}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);
            if (game.started == false) {throw "Game has not started yet."}

            return "success"
        },

        endTurn: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            return "success"
        }
    }
};