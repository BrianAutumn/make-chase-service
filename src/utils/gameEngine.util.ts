import {Board} from "../data-models";

export type Action = {
  code:String,
  args:any
}

export function validateMove(board:Board, actions:[Action], user:String):Boolean{
  return true;
}

export function commitMove(board:Board, actions:[Action]):Board{
  return null;
}

export function filterView(board:Board, view:String):Board{
  return null;
}

export function makeDiff(beforeBoard:Board, afterBoard:Board):String{
  return ''
}

export function makeMove(board:Board, actions:[Action], user:String){
  if(!validateMove(board,actions,user)){
    throw 'INVALID_MOVE';
  }
  let newBoard = commitMove(board,actions);
  
}