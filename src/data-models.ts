import {Schema, model, connection, Model} from 'mongoose';

export const MessageModel = buildModel('Message', () => {
    const schema = new Schema({
        timestamp: {type: String, required: true},
        text: {type: String, required: true},
        type: {type: String, required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    });
    return model('Message', schema);
})

export const UserModel = buildModel('User', () => {
    const schema = new Schema({
        sub: {type: String, required: true},
        iss: {type: String, required: true},
        displayName: {type: String, required: true},
        email: {type: String, required: true},
        created: {type: String, required: true}
    });
    return model('User', schema);
})

export const GameModel = buildModel('Game', () => {
    const schema = new Schema({
        created: {type: String, required: true},
        state: {type: String, required: true, enum: ['LOBBY', 'CLOSED', 'ENDED', 'ACTIVE']},
        name: {type: String, required: true},
        users: [{type: Schema.Types.ObjectId, ref: 'User'}]
    });
    return model('Game', schema);
})

export type Board = {
    turn: String
    roles: Array<Role>,
    pieces: Array<Piece>,
    nodes: Array<BoardNode>,
    connections: Array<Array<String>>
}

export type Role = {
    role: String,
    user: User
}

export type User = {
    _id:string,
    displayName:string
}

export type Piece = {
    label: String,
    location: String
}

export type BoardNode = {
    label: String,
    x: Number,
    y: Number
}

export const BoardModel = buildModel('Board', () => {
    const schema = new Schema({
        gameId: {type: Schema.Types.ObjectId, ref: 'Game'},
        board: {
            turn: {type: String},
            roles: [{
                role: String,
                user: {type: Schema.Types.ObjectId, ref: 'User'}
            }],
            pieces: [{
                label: String,
                location: {type: String, required: true},
                $view: String
            }],
            nodes: [{
                label: String,
                x: {type: Number, required: true},
                y: {type: Number, required: true}
            }],
            connections: [[String]]
        }
    });
    return model('Board', schema);
})

/**
 * A function used to make sure we do not repeat declare models. Seems to be an issue with serverless offline.
 *
 * @param name name of the model to build.
 * @param build The function to build the model if the model has not already been built.
 */
function buildModel(name: string, build: () => Model<any>): Model<any> {
    if (connection.models[name]) {
        console.warn(`Mongoose Model '${name}' already declared!`);
        return connection.models[name];
    } else {
        return build();
    }
}