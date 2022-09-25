import {Board, BoardConnection} from "../data-models";

export function getMyRole(board, myUserId) {
  return board?.roles.find(role => role.user._id === myUserId).role;
}

export function isMyTurn(board, myUserId) {
  let myRole = getMyRole(board,myUserId);
  if(!myRole){
    return false;
  }
  return board?.turn.role === getMyRole(board, myUserId);
}

export function getMyLocation(board, myUserId) {
  return board?.pieces.find(piece => piece.label === getMyRole(board, myUserId)).location;
}

export function getAdjacentNodes(connections:Array<BoardConnection>, nodeLabel:string):Array<string> {
  let adjacentNodes = new Set<string>();
  for (let connection of connections) {
    if (connection.nodes.includes(nodeLabel) && !connection.state.includes('BLOCKED')) {
      connection.nodes.forEach(node => adjacentNodes.add(node))
    }
  }
  return [...adjacentNodes];
}

export function getConnectedNodes(connections:Array<BoardConnection>, nodeLabel:string):Array<string>{
  let checkedNodes = new Set();
  let connected = new Set(getAdjacentNodes(connections,nodeLabel));
  let uncheckedNodes = [...connected];
  while (uncheckedNodes.length !== 0) {
    checkedNodes.add(uncheckedNodes[0])
    for(let node of getAdjacentNodes(connections,uncheckedNodes[0])){
      connected.add(node);
      if(!checkedNodes.has(node)){
        uncheckedNodes.push(node)
      }
    }
    uncheckedNodes.shift();
  }
  return [...connected]
}