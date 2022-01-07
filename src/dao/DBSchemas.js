import * as mongoose from "mongoose";
import {Tokens} from "../resources/tokens";

const url = Tokens.isOffline ? Tokens.testDBConnection : Tokens.liveDBConnection;

export async function initMongo(){
    await mongoose.connect(url);
}

const ConnectionSchema = new mongoose.Schema({
    connectionId:{type:String,required:true},
    userId:{type:String,required:false,default:''},
    establishedTS:{type:Number,required:true}
})
export const Connection = mongoose.model('Connection', ConnectionSchema);