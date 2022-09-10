import {Board, BoardModel} from "../data-models";
import {cloneDeep} from "lodash";
import {pubSub} from "../graphqlResources";
import {createDelta} from "./delta.util";

export type Action = {
  code:String,
  args:any
}

export async function startGame(gameId:String){
  let newBoard = new BoardModel();
  newBoard.board = {
    pieces:{
      runner:{
        location:'B'
      },
      chaser:{
        location:'C'
      }
    },
    nodes:{
      A:{
        x:10,
        y:20,
      },
      B:{
        x:30,
        y:70,
      },
      C:{
        x:70,
        y:90
      },
      D:{
        x:80,
        y:30
      },
      E:{
        x:45,
        y:5
      }
    },
    connections:[
      ['A','B'],
      ['B','C'],
      ['C','A'],
      ['D','C'],
      ['A','E'],
      ['E','D']
    ]
  };
  newBoard.gameId = gameId;
  await newBoard.save();
}

export async function makeMove(gameId:string, board:Board, actions:[Action], user:String){
  validateMove(board,actions,user);
  let newBoard = cloneDeep(board);
  actions.forEach(action => commitMove(newBoard,action,user));
  await pubSub.publish('UPDATE_BOARD',{gameId,update:createDelta(board,newBoard)})
}

function validateMove(board:Board, actions:[Action], user:String):Boolean{
  if(actions.length > 1){
    throw 'TOO_MANY_ACTIONS'
  }
  if(actions[0].code !== 'MOVE'){
    throw 'NOT_VALID_MOVE'
  }
  if(!actions[0].args.space){
    throw 'SPACE_NEEDED_FOR_MOVE'
  }
  if(!Object.keys(board.spaces).includes(actions[0].args.space)){
    throw 'NOT_VALID_SPACE'
  }
  fetchRole(board.roles,user);
  return true;
}

function commitMove(board:Board, action:Action, user:String):Board{
  let subject = fetchRole(board.roles,user);
  board.pieces[subject].location = action.args.space;
  return board;
}

function fetchRole(roles, user){
  let subject;
  for(let role in roles){
    if(roles[role] === user){
      subject = role;
    }
  }
  if(!subject){
    throw 'USER_NO_ROLE'
  }
  return subject;
}