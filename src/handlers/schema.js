import {gql} from 'apollo-server-lambda'

export const Schema = gql`
    scalar JSON
    scalar JSONObject
    scalar Void

    type Query {
    }

    type Mutation {
    }
`;
