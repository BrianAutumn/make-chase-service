import {Board, BoardModel, Role} from "../data-models";
import {shuffle} from "lodash";
import {readFileSync} from "fs";
import {appConf} from "../appConf";
import {join} from "path";

const defaultBoard = JSON.parse(readFileSync(join(appConf.resources, 'defaultBoard.json')).toString())

export type Action = {
    code: string,
    args: any
}

export async function startGame(gameId: string, users: Array<string>) {
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
    console.log('newBoard_log',JSON.stringify(newBoard))
    await newBoard.save();
}

export async function makeActions(board: Board, actions: [Action], userId: string) {
    if(actions.length < 1){
        throw 'NO_ACTIONS'
    }
    if(actions.length > 1){
        throw 'TOO_MANY_ACTIONS'
    }
    commitAction(board, actions[0], userId)
    return board
}

function commitAction(board: Board, action: Action, userId: string) {
    switch (action.code){
        case 'MOVE':
            return commitMoveAction(board,action.args,userId)
        default:
            throw 'INVALID_ACTION'
    }
}

function commitMoveAction(board:Board, targetNode:string, userId:string){
    //Validate
    if (!targetNode) {
        throw 'SPACE_NEEDED_FOR_MOVE'
    }
    if (!board.nodes.map(node => node.label).includes(targetNode)) {
        throw `NOT_VALID_SPACE '${targetNode}'`
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
    if (targetNode === piece.location) {
        throw `SPACE_ALREADY_OCCUPIED '${targetNode}'`
    }
    if(board.connections.filter(connection => connection.includes(piece.location) && connection.includes(targetNode)).length === 0){
        throw `NO_CONNECTION '${targetNode}'`
    }

    //Execute
    board.pieces.find(piece => piece.label === role).location = targetNode;
}

function fetchRoles(roles:Array<Role>, userId:string) {
    let foundRoles = [];
    for (let role of roles) {
        console.log('role log',role.user._id.toString(),userId)
        if (role.user._id.toString() === userId) {
            foundRoles.push(role.role)
        }
    }
    return foundRoles;
}