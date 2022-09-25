import {floor} from "lodash";
import {BoardNode} from "../data-models";
import {circleCircle} from 'intersects';

const REJECTED_LIMIT_MULTIPLIER = 100
const A_CODE = 65;

export function generateRandomNodesBest(width: number, height: number, nodes: number, nodeRadius: number, nodeInfluenceMultiplier = 2): Array<BoardNode>{
  let result = [];
  while(result.length === 0 && nodes > 0){
    result = generateRandomNodes(width,height,nodes,nodeRadius,nodeInfluenceMultiplier);
    nodes--;
  }
  return result;
}

export function generateRandomNodes(width: number, height: number, nodes: number, nodeRadius: number, nodeInfluenceMultiplier = 2): Array<BoardNode> {
  let nodeList = new Array<BoardNode>();
  let rejectedLimit = nodes * REJECTED_LIMIT_MULTIPLIER;
  let rejected = 0;
  while (rejected < rejectedLimit && nodeList.length < nodes) {
    let subject = pickNode(width - nodeRadius * 2, nodeRadius * 2, height - nodeRadius * 2, nodeRadius * 2)
    if (collidesAny(subject, nodeList, nodeRadius * nodeInfluenceMultiplier)) {
      rejected++;
    } else {
      nodeList.push(subject);
    }
  }
  if (rejected >= rejectedLimit) {
    return [];
  }
  for(let i in nodeList){
    nodeList[i].label = indexToLabel(i);
  }
  return nodeList;
}

function pickNode(widthMax: number, widthMin: number, heightMax: number, heightMin: number): BoardNode {
  return {
    x: (Math.random() * (widthMax - widthMin)) + widthMin,
    y: (Math.random() * (heightMax - heightMin)) + heightMin,
    state:[],
    label:''
  };
}

function collidesAny(node: BoardNode, nodeList: Array<BoardNode>, radius: number): boolean {
  for(let subject of nodeList){
    if(collides(node,subject,radius)){
      return true;
    }
  }
  return false;
}

function collides(nodeA:BoardNode, nodeB:BoardNode, radius:number):boolean{
  return circleCircle(nodeA.x,nodeA.y,radius,nodeB.x,nodeB.y,radius)
}

function indexToLabel(index) {
  let result = ''
  let done = false;
  while(!done) {
    result += String.fromCharCode(A_CODE + index % 26);
    index = floor(index / 26);
    if(index > 0){
      index = index - 1;
    }else{
      done = true;
    }
  }
  return result.split('').reverse().join('');
}