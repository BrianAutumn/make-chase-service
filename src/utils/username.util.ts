import {join} from "path";
import {readFileSync} from 'fs';
import {appConf} from "../app-conf";

let animals = generateMap(readFileSync(join(appConf.resources, 'Animals.txt')).toString());
let adjectives = generateMap(readFileSync(join(appConf.resources, 'Adjectives.txt')).toString());

export function generateName(first = selectRandomKey(adjectives), last = selectRandomKey(animals)) {
  console.log(JSON.stringify(animals),JSON.stringify(adjectives));
  console.log('Flag AAA',last[0].toLowerCase())
  let animal = selectRandom(animals[last[0].toLowerCase()]);
  let adjective = selectRandom(adjectives[first[0].toLowerCase()]);
  return capitalize(adjective) + capitalize(animal);
}

function generateMap(string) {
  let map = {}
  string.split('\r\n').forEach(word => {
    word.toLowerCase();
    if (!map[word[0]]) {
      map[word[0]] = new Set();
    }
    map[word[0]].add(word.replace('\n',''))
  })
  Object.keys(map).forEach(key => {
    map[key] = Array.from(map[key])
  })
  return map;
}

function selectRandom(array) {
  console.log('Flag AA', array)
  return array[Math.floor(Math.random() * array.length)]
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1)
}

function selectRandomKey(obj) {
  return selectRandom(Object.keys(obj));
}