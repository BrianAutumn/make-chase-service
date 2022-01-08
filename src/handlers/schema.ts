import {gql} from 'apollo-server-lambda'

export const Schema = gql`
    type Query {
        getTurn(game_id: Int): String,
        getGame(game_id: Int): String,
        getMap(game_id: Int): String,
    }

    type Mutation {
        makeGame(game_type: String): Int,
        joinGame(game_id: Int, role: String): String,
        moveToNode(game_id: Int, node_id: Int): String,
        burnPath(game_id: Int, path_id: Int): String,
        endTurn(game_id: Int): String,
    }
    
    type Example {
        name: Float,
        time: Float
    }
`;
