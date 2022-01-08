import * as mongoose from "mongoose";
import {Tokens} from "../resources/tokens";



const url = Tokens.isOffline ? Tokens.testDBConnection : Tokens.liveDBConnection;

// mongoose.connect is async, must be called in async function and must be awaited before interacting with mongoose models
export async function initMongo(){
    console.log("MongoDB Connection String: ", url);
    await mongoose.connect(url);
}

const ConnectionSchema = new mongoose.Schema({
    connectionId:{type:String,required:true},
    userId:{type:String,required:false,default:''},
    establishedTS:{type:Number,required:true}
})
// must have || check so we do not create same connection object twice on automatic code refresh
export const Connection = mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);

const MapSchema = new mongoose.Schema({
    type: {type:String, required: true},
})
export const Map = mongoose.models.Map || mongoose.model('Map', MapSchema);

const NodeSchema = new mongoose.Schema({
    x_pos: {type:Number, required: true},
    y_pos: {type:Number, required: true},
    map: {type:MapSchema, required:true},
})
export const Node = mongoose.models.Node || mongoose.model('Node', NodeSchema);

const PathSchema = new mongoose.Schema({
    first_node: {type:NodeSchema, required:true},
    second_node: {type:NodeSchema, required:true},
    map: {type:MapSchema, required:true},
    is_broken: {type:Boolean, required:true}
})
export const Path = mongoose.models.Path || mongoose.model('Path', PathSchema);

const PlayerSchema = new mongoose.Schema({
    role: {type:String, required: true},
    node: {type:NodeSchema, required:false},
})
export const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema);

const GameSchema = new mongoose.Schema({
    map_id: {type:MapSchema, required: false},
    hider: {type:PlayerSchema, required: false},
    seeker: {type:PlayerSchema, required: false},
    turn: {type:String, required: true},
    started: {type:Boolean, required: true}
})
export const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

const ActionSchema = new mongoose.Schema({
    game: {type:GameSchema, required: true},
    player: {type:PlayerSchema, required: true},
    type: {type:String, required: true},
    options: {type:String, required: true},
    timestamp: {type:Number, required: true}
})
export const Action = mongoose.models.Action || mongoose.model('Action', ActionSchema);

