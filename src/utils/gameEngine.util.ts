import {Board, BoardModel} from "../data-models";
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
    newBoard.board.roles = {
        chaser: users[0],
        runner: users[1]
    }
    console.log(newBoard);
    await newBoard.save();
}

export async function makeMove(gameId: string, board: Board, actions: [Action], user: String) {
    validateMove(board, actions, user);
    let newBoard = cloneDeep(board);
    actions.forEach(action => commitMove(newBoard, action, user));
    await pubSub.publish('UPDATE_BOARD', {gameId, update: createDelta(board, newBoard)})
}

function validateMove(board: Board, actions: [Action], user: String): Boolean {
    if (actions.length > 1) {
        throw 'TOO_MANY_ACTIONS'
    }
    if (actions[0].code !== 'MOVE') {
        throw 'NOT_VALID_MOVE'
    }
    if (!actions[0].args.space) {
        throw 'SPACE_NEEDED_FOR_MOVE'
    }
    if (!Object.keys(board.spaces).includes(actions[0].args.space)) {
        throw 'NOT_VALID_SPACE'
    }
    fetchRole(board.roles, user);
    return true;
}

function commitMove(board: Board, action: Action, user: String): Board {
    let subject = fetchRole(board.roles, user);
    board.pieces[subject].location = action.args.space;
    return board;
}

function fetchRole(roles, user) {
    let subject;
    for (let role in roles) {
        if (roles[role] === user) {
            subject = role;
        }
    }
    if (!subject) {
        throw 'USER_NO_ROLE'
    }
    return subject;
}