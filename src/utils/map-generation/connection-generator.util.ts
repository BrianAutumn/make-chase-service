import {BoardNode} from "../../data-models";
import {shuffle} from "lodash";
import {lineCircle} from "intersects";
import {getConnectedNodes} from "../board.utils";

const REJECTION_LIMIT = 10000;
type Connection = Array<string>;

export function generateRandomConnections(nodes:Array<BoardNode>, connections:number, nodeRadius, nodeInfluenceModifier = 2):Array<Connection>{
  let nodeMap = {};
  nodes.forEach(node => nodeMap[node.label] = node);

  let result = connectIslands([], nodeMap, nodeRadius);
  let combos = getAllCombinations(nodes);
  result.forEach(connection => combos = combos.filter(combo => JSON.stringify(combo.sort()) !== JSON.stringify(connection.sort())))
  combos = shuffle(combos);

  let i = 0;
  while(result.length < connections && i < combos.length){
    if(!connectionCollides(combos[i],nodeMap,result,nodeRadius  * nodeInfluenceModifier)){
      result.push(combos[i])
    }
    i++
  }
  return result;
}

export function getAllCombinations(nodes:Array<BoardNode>):Array<Array<string>>{
  return nodes.flatMap(
    (v, i) => nodes.slice(i+1).map( w => [v.label,w.label] )
  );
}

function connectionCollides(subject:Array<string>,nodeMap:Record<string,BoardNode>,connections:Array<Array<string>>,nodeRadius){
  return collidesNodes(subject, nodeMap, nodeRadius);
}

function collidesNodes(connection:Array<string>,nodeMap:Record<string,BoardNode>,nodeRadius:number):boolean{
  let start = nodeMap[connection[0]];
  let end = nodeMap[connection[1]]
  for(let node of Object.values(nodeMap)){
    if(connectionCollidesNode(start,end,node,nodeRadius)){
      return true;
    }
  }
  return false;
}

function connectionCollidesNode(connectionStart:BoardNode,connectionEnd:BoardNode,node:BoardNode,nodeRadius:number):boolean{
  if(connectionStart.label === node.label || connectionEnd.label === node.label){
    return false;
  }
  return lineCircle(connectionStart.x, connectionStart.y, connectionEnd.x, connectionEnd.y, node.x, node.y,nodeRadius);
}

export function findIslands(connections:Array<Array<string>>,nodeMap:Record<string,BoardNode>):Array<Array<string>>{
  let boardConnections = connections.map(connection => {return {nodes:connection,state:[]}})
  let islands = []
  let nodes = Object.keys(nodeMap)
  while(nodes.length > 0){
    let connections = getConnectedNodes(boardConnections,nodes[0]);
    connections.push(nodes[0])
    islands.unshift(connections)
    nodes = nodes.filter(node => !islands[0].includes(node))
  }
  return islands;
}

function connectIslands(connections:Array<Array<string>>,nodeMap:Record<string,BoardNode>,nodeRadius:number){
  let islands = findIslands(connections,nodeMap);
  let rejections = 0;
  while(islands.length > 1 && rejections < REJECTION_LIMIT){
    islands = shuffle(islands);
    let islandOne = shuffle(islands[0]);
    let islandTwo = shuffle(islands[1]);
    if(!connectionCollides([islandOne[0],islandTwo[0]],nodeMap,connections,nodeRadius)){
      connections.push([islandOne[0],islandTwo[0]])
      islands = findIslands(connections,nodeMap);
    }else{
      rejections++;
    }
  }
  if(rejections >= REJECTION_LIMIT){
    throw 'ISLANDS COULD NOT BE CONNECTED!'
  }
  return connections;
}

// function collidesConnections(connection:Array<string>,nodeMap:Record<string,BoardNode>,connections:Array<Array<string>>){
//   let start = nodeMap[connection[0]];
//   let end = nodeMap[connection[1]]
//   for(let connection of connections){
//     if(connectionCollidesConnection(start,end,nodeMap[connection[0]],nodeMap[connection[1]])){
//       return true;
//     }
//   }
//   return false;
// }

// function connectionCollidesConnection(aStart:BoardNode,aEnd:BoardNode,bStart:BoardNode,bEnd:BoardNode):boolean{
//   return lineLine(aStart.x, aStart.y, aEnd.x, aEnd.y, bStart.x, bStart.y, bEnd.x, bEnd.y, 1, 1);
// }