import {Board, BoardModel, Role} from "../data-models";
import {cloneDeep, shuffle} from "lodash";
import {pubSub} from "../graphqlResources";
import {createDelta} from "./delta.util";
import {readFileSync} from "fs";
import {appConf} from "../appConf";
import {join} from "path";

const defaultBoard = JSON.parse(readFileSync(join(appConf.resources, 'defaultBoard.json')).toString())

export type Action = {
    code: String,
    args: any
}

export async function startGame(gameId: String, users: Array<string>) {
    let newBoard = new BoardModel();
    newBoard.board = defaultBoard;
    newBoard.gameId = gameId;
    users = shuffle(users);
    newBoard.board.roles = [
        {
            role:'chaser',
            user:users[0]
        },
        {
            role:'runner',
            user:users[1]
        }
    ]
    console.log(newBoard);
    await newBoard.save();
}

export async function makeActions(board: Board, actions: [Action], userId: String) {
    if(actions.length < 1){
        throw 'NO_ACTIONS'
    }
    if(actions.length > 1){
        throw 'TOO_MANY_ACTIONS'
    }
    commitAction(board, actions[0], userId)
    return board
}

function commitAction(board: Board, action: Action, userId: String) {
    switch (action.code){
        case 'MOVE':
            return commitMoveAction(board,action.args,userId)
        default:
            throw 'INVALID_ACTION'
    }
}

function commitMoveAction(board, moveArgs, userId){
    //Validate
    if (!moveArgs.space) {
        throw 'SPACE_NEEDED_FOR_MOVE'
    }
    if (!Object.keys(board.nodes).includes(moveArgs.space)) {
        throw 'NOT_VALID_SPACE'
    }
    let roles = fetchRoles(board.roles, userId);
    if(roles.length === 0){
        throw 'NO_ROLE'
    }
    if(roles.length > 1){
        throw 'TOO_MANY_ROLES'
    }
    let role = roles[0];
    let piece = board.pieces.find(piece => piece.label === role)
    if(board.connections.filter(connection => connection.includes(piece.location) && connection.includes(moveArgs.space)).length === 0){
        throw 'NO_CONNECTION'
    }

    //Execute
    board.pieces.find(piece => piece.label === role).location = moveArgs.space;
}

function fetchRoles(roles:Array<Role>, userId:String) {
    let foundRoles = [];
    for (let role of roles) {
        if (role.user === userId) {
            foundRoles.push(role.role)
        }
    }
    return foundRoles;
}