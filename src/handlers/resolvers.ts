import GraphQLJSON, {GraphQLJSONObject} from "graphql-type-json";
import * as mongoose from "mongoose";
import * as dbschemas from "../dao/DBSchemas";
import * as utils from "../resources/utils";

export const Resolvers = {

    Query: {
        getTurn: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            return "hider"
        },

        getGame: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);
            console.log('Game map id: ', game.map._id);

            const map_id = game.map ? game.map._id : null;
            const hider_id = game.hider ? game.hider._id : null;
            const seeker_id = game.seeker ? game.seeker._id : null;

            return {
                'game_id': game._id,
                'map_id': map_id,
                'hider_id': hider_id,
                'seeker_id': seeker_id,
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

            const new_game = new dbschemas.Game({'turn': 'hider', 'started': false});
            await new_game.save();

            return new_game._id;
        },

        joinGame: async (parent, {game_id, role}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);
            console.log('seeker ', game.seeker);

            if (role == 'seeker' && game.seeker) {
                throw "Seeker has already joined the game.";
            }
            if (role == 'hider' && game.hider) {
                throw "Hider has already joined the game.";
            }

            const player = new dbschemas.Player({'role': role})

            if (role == 'hider') {
                game.hider = player;
            }
            if (role == 'seeker') {
                game.seeker = player;
            }

            await game.save();

            return player.role;
        },

        startGame: async (parent, {game_id}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);

            if (game.hider == null || game.seeker == null) {
                throw "Not enough players to start the game.";
            }

            // we should generate map right about now
            await utils.generate_base_map(game);

            game.started = true;

            await game.save();

            return "success";
        },

        takeTurn: async (parent, {game_id, player_id, actions}) => {
            await dbschemas.initMongo();

            const game = await dbschemas.Game.findById(game_id);

            if (!game.started) {throw "Game has not yet begun."}

            const player = await dbschemas.Player.findById(player_id);

            const now = Date.now(); //moment when action was taken

            var db_actions = [];

            for (let idx = 0; idx < actions.length; idx++) {
                const input_action = actions[idx];
                const action = new dbschemas.Action({
                    'game': game,
                    'player': player,
                    'type': input_action['type'],
                    'options': input_action['options'],
                    'timestamp': now,
                })
                db_actions.push(action);
            }

            await utils.process_actions(game, db_actions);

            await game.save();

            return actions[0]['type'];
        }

    }
};