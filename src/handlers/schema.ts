import {gql} from 'apollo-server-lambda'

export const Schema = gql`
    type Query {
        getTurn(game_id: String): String,
        getGame(game_id: String): Game,
        getMap(game_id: String): String,
    }

    type Mutation {
        makeGame(game_type: String): String,
        joinGame(game_id: String, role: String): String,
        startGame(game_id: String): String,
        takeTurn(game_id: String, player_id: String, actions: [Action]): String
    }
    
    type Example {
        name: Float,
        time: Float
    }

    input Action {
        type: String,
        options: String,
    }

    type Game {
        game_id: String,
        map_id: Int,
        hider_id: String,
        seeker_id: String
    }
`;
