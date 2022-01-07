import {gql} from 'apollo-server-lambda'

export const Schema = gql`
    type Query {
        example(name: String): Example
    }
    
    type Example {
        name: String,
        time: Float
    }
`;
