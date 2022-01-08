import * as mongoose from "mongoose";
import {Tokens} from "../resources/tokens";

const url = Tokens.isOffline ? Tokens.testDBConnection : Tokens.liveDBConnection;

mongoose.connect(url);

const ConnectionSchema = new mongoose.Schema({
    connectionId:{type:String,required:true},
    userId:{type:String,required:false,default:''},
    establishedTS:{type:Number,required:true}
})
export const Connection = mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);

const GameSchema = new mongoose.Schema({
    gameId: {type:Number, required: true},
    mapId: {type:Number, required: true}
})
export const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

