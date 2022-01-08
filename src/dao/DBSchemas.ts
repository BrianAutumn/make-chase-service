import * as mongoose from "mongoose";
import {Tokens} from "../resources/tokens";



const url = Tokens.isOffline ? Tokens.testDBConnection : Tokens.liveDBConnection;

// mongoose.connect is async, must be called in async function and must be awaited before interacting with mongoose models
export async function initMongo(){
    await mongoose.connect(url);
}

const ConnectionSchema = new mongoose.Schema({
    connectionId:{type:String,required:true},
    userId:{type:String,required:false,default:''},
    establishedTS:{type:Number,required:true}
})
// must have || check so we do not create same connection object twice on automatic code refresh
export const Connection = mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);

const NodeSchema = new mongoose.Schema({
    x_pos: {type:Number, required: true},
    y_pos: {type:Number, required: true},
    map_id: {type:mongoose.Types.ObjectId, required:true},
})
export const Node = mongoose.models.Node || mongoose.model('Node', NodeSchema);

const PathSchema = new mongoose.Schema({
    first_node_id: {type:mongoose.Types.ObjectId, required:true},
    second_node_id: {type:mongoose.Types.ObjectId, required:true},
    map_id: {type:mongoose.Types.ObjectId, required:true},
    is_broken: {type:Boolean, required:true}
})
export const Path = mongoose.models.Path || mongoose.model('Path', PathSchema);

const MapSchema = new mongoose.Schema({
    hider_id: {type:Number, required: true},
    seeker_id: {type:Number, required: true}
})
export const Map = mongoose.models.Map || mongoose.model('Map', MapSchema);

const PlayerSchema = new mongoose.Schema({
    role: {type:String, required: true},
    node_id: {type:mongoose.Types.ObjectId, required:false},
})
export const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema);

const GameSchema = new mongoose.Schema({
    map_id: {type:mongoose.Types.ObjectId, required: false},
    hider_id: {type:mongoose.Types.ObjectId, required: false},
    seeker_id: {type:mongoose.Types.ObjectId, required: false},
    turn: {type:String, required: true},
    started: {type:Boolean, required: true}
})
export const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

