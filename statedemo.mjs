import {createMachine, State} from "xstate";
import {readFileSync, writeFileSync} from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let machineDef = JSON.parse(readFileSync(join(__dirname,'machine.json')).toString());
let machine = createMachine(machineDef);
// const { initialState } = machine;
// let then = machine.transition(initialState, 'PLAYER_ENTER')
// console.log(then);
// then = machine.transition(then, 'PLAYER_LEAVE')
// console.log(then);
// then = machine.transition(then, 'PLAYER_LEAVE')
// console.log(then);
// writeFileSync(join(__dirname,'result.json'),JSON.stringify(then));
const {initialState} = machine;
let restoredState = {};
let previous = JSON.parse(readFileSync(join(__dirname,'result.json')).toString());
Object.assign(restoredState,initialState);
Object.assign(restoredState,previous)
let result = State.create(restoredState);
console.log(result);