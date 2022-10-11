import {tokens} from "./tokens";
import * as dotenv from 'dotenv'

dotenv.config()

export function getToken(name){
  if(!tokens[name]){
    throw `Token '${name}' not defined!`
  }
  if(isSet(tokens[name].token) || !process.env[name]){
    return tokens[name].token
  }
  return process.env[name];
}

function isSet(tokenValue){
  return !tokenValue.startsWith('##') && !tokenValue.endsWith('##')
}