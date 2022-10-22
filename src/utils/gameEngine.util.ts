import {Board, BoardModel, Role} from "../data-models";
import {cloneDeep, shuffle} from "lodash";
import {readFileSync} from "fs";
import {appConf} from "../app-conf";
import {join} from "path";
import {getConnectedNodes} from "./board.utils";
import {generateMap} from "./map-generation/map-generator.util";

const defaultBoard = JSON.parse(readFileSync(join(appConf.resources, 'defaultBoard.json')).toString())
const defaultMap = JSON.parse(readFileSync(join(appConf.resources, 'defaultMap.json')).toString())

export type Action = {
  code: string,
  args: any
}

export async function startGame(gameId: string, users: Array<string>, map: string) {
    let newBoard = new BoardModel();
    newBoard.board = defaultBoard;
    if(map === 'RANDOM'){
      let randomBoard = generateMap(100,100,13,4,40)
      newBoard.board.nodes = randomBoard.nodes;
      newBoard.board.connections = randomBoard.connections;
    }else if(map === 'DEFAULT'){
      newBoard.board.nodes = defaultMap.nodes;
      newBoard.board.connections = defaultMap.connections;
    }
    newBoard.gameId = gameId;
    users = shuffle(users);
    let nodes = shuffle(cloneDeep(newBoard.board.nodes));
    for(let i in newBoard.board.pieces){
      newBoard.board.pieces[i].location = nodes[i].label;
    }
    newBoard.board.roles = [
      {
        role: 'chaser',
        user: users[0]
      },
      {
        role: 'runner',
        user: users[1]
      }
    ]
    await newBoard.save();
}

export async function makeActions(board: Board, actions: [Action], userId: string) {
  if(board.victory){
    throw 'BOARD_VICTORIOUS'
  }
  let userRole = board.roles.find(role => role.user._id.toString() === userId)?.role;
  if (userRole !== board.turn.role) {
    throw `NOT_USERS_TURN '${userRole}'`
  }
  if (actions.length < board.turn.actions.length) {
    throw 'TOO_FEW_ACTIONS'
  }
  if (actions.length > board.turn.actions.length) {
    throw 'TOO_MANY_ACTIONS'
  }
  for(let i in actions){
    if(actions[i].code !== board.turn.actions[i]){
      throw `ACTION_NOT_ALLOWED '${actions[i].code} '${board.turn.actions[i]}'`
    }
    commitAction(board,actions[i],userId)
  }
  commitAction(board, actions[0], userId)
  let victory = checkVictory(board);
  if(victory){
    board.pieces.find(piece => piece.label === 'runner').$view = undefined;
    board.victory = victory;
  }else{
    commitSwitchTurns(board);
  }
  return board
}

function checkVictory(board:Board){
  let runnerLocation = board.pieces.find(piece => piece.label === 'runner').location;
  let chaserLocation = board.pieces.find(piece => piece.label === 'chaser').location;
  if(runnerLocation === chaserLocation){
    return 'chaser'
  }
  if(board.nodes.find(node => node.label === runnerLocation).state.includes('BLOCKED')){
    return 'runner';
  }
}

function commitSwitchTurns(board: Board) {
  board.turn.count++;
  if(board.turn.role === 'chaser'){
    board.turn.role = 'runner';
    board.turn.actions = ['MOVE']
  }else{
    board.turn.role = 'chaser';
    board.turn.actions = ['MOVE','BLOCK']
  }
}

function commitAction(board: Board, action: Action, userId: string) {
  switch (action.code) {
    case 'MOVE':
      return commitMoveAction(board, JSON.parse(action.args), userId)
    case 'BLOCK':
      return commitBlockAction(board, JSON.parse(action.args))
    default:
      throw 'INVALID_ACTION'
  }
}

function commitMoveAction(board: Board, targetNode: string, userId: string) {
  //Validate
  if (!targetNode) {
    throw 'SPACE_NEEDED_FOR_MOVE'
  }
  if (!board.nodes.map(node => node.label).includes(targetNode)) {
    throw `NOT_VALID_SPACE '${targetNode}'`
  }
  let roles = fetchRoles(board.roles, userId);
  if (roles.length === 0) {
    throw 'NO_ROLE'
  }
  if (roles.length > 1) {
    throw 'TOO_MANY_ROLES'
  }
  let role = roles[0];
  let piece = board.pieces.find(piece => piece.label === role)
  if (board.connections.filter(connection => connection.nodes.includes(piece.location) && connection.nodes.includes(targetNode)).length === 0) {
    throw `NO_CONNECTION '${targetNode}'`
  }

  //Execute
  board.pieces.find(piece => piece.label === role).location = targetNode;
}

function commitBlockAction(board: Board, targetConnection: Array<string>) {
  //Validate
  let connection = board.connections.find(connection => JSON.stringify(connection.nodes.sort()) === JSON.stringify(targetConnection.sort()))
  if(!connection){
    throw 'CONNECTION_NOT_FOUND'
  }
  if(connection.state.includes('BLOCKED')){
    throw 'CONNECTION_ALREADY_BLOCKED'
  }

  //Execute
  connection.state.push('BLOCKED');
  let chaserLocation = board.pieces.find(piece => piece.label === 'chaser').location;
  let chaserConnected = getConnectedNodes(board.connections,chaserLocation);
  let unconnectedNodes = new Set(board.nodes.map(node => node.label));
  chaserConnected.forEach(node => unconnectedNodes.delete(node))
  unconnectedNodes.forEach(nodeLabel => board.nodes.find(node => node.label === nodeLabel).state.push('BLOCKED'))
}

function fetchRoles(roles: Array<Role>, userId: string) {
  let foundRoles = [];
  for (let role of roles) {
    if (role.user._id.toString() === userId) {
      foundRoles.push(role.role)
    }
  }
  return foundRoles;
}