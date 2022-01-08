import {gql} from 'apollo-server-lambda'

export const Schema = gql`
    type Query {
        getTurn(game_id: String): String,
        getGame(game_id: String): Game,
        getMap(game_id: String): String,
    }

    type Mutation {
        makeGame(game_type: String): String,
        joinGame(game_id: Int, role: String): String,
        moveToNode(game_id: String, node_id: String): String,
        burnPath(game_id: String, path_id: String): String,
        endTurn(game_id: String): String,
    }
    
    type Example {
        name: Float,
        time: Float
    }

    type Game {
        game_id: String,
        map_id: Int,
    }
`;
