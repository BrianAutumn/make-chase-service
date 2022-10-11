import {tokens} from "./tokens";
import * as dotenv from 'dotenv'

dotenv.config()

//Stupid workaround for the token replacement mechanism
const tokenDeliminator = '#'

export function getToken(name){
  if(!tokens[name]){
    throw `Token '${name}' not defined!`
  }
  if(isSet(tokens[name].token,name) || !process.env[name]){
    return tokens[name].token
  }
  return process.env[name];
}

function isSet(tokenValue, name){
  return tokenValue !== (tokenDeliminator + tokenDeliminator + name + tokenDeliminator + tokenDeliminator)
}