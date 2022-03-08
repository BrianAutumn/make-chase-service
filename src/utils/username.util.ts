import {join} from "path";
import {readFileSync} from 'fs';

let animals = generateMap(readFileSync(join(__dirname,'./resources/Animals.txt')).toString());
let adjectives = generateMap(readFileSync(join(__dirname,'./resources/Adjectives.txt')).toString());

export function generateName(first = selectRandomKey(adjectives), last = selectRandomKey(animals)){
  let animal = selectRandom(animals[last[0].toLowerCase()]);
  let adjective = selectRandom(adjectives[first[0].toLowerCase()]);
  return capitalize(adjective) + capitalize(animal);
}

function generateMap(string){
  let map = {}
  string.split('\r\n').forEach(word => {
    word.toLowerCase();
    if(!map[word[0]]){
      map[word[0]] = new Set();
    }
    map[word[0]].add(word)
  })
  Object.keys(map).forEach(key => {
    map[key] = Array.from(map[key])
  })
  return map;
}

function selectRandom(array){
  return array[Math.floor(Math.random() * array.length)]
}

function capitalize(word){
  return word[0].toUpperCase() + word.slice(1)
}

function selectRandomKey(obj){
  return selectRandom(Object.keys(obj));
}