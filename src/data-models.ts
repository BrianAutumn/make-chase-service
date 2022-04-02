import {Schema, model, connection, Model} from 'mongoose';

export const MessageModel = buildModel('Message', () => {
  const schema = new Schema({
    timestamp: {type:String, required:true},
    text: {type:String, required:true},
    type: {type:String, required:true},
    user: {type:Schema.Types.ObjectId, ref:'User', required:true}
  });
  return model('Message',schema);
})

export const UserModel = buildModel('User', () => {
  const schema = new Schema({
    sub: {type:String, required:true},
    iss: {type:String, required:true},
    displayName: {type:String, required:true},
    email: {type:String, required:true},
    created: {type:String,required:true}
  });
  return model('User',schema);
})

export const GameModel = buildModel('Game', () => {
  const schema = new Schema({
    created: {type:String,required:true},
    state: {type:String, required:true, enum:['LOBBY','CLOSED'], default:'LOBBY'},
    name: {type:String,required:true},
    users: [{type:Schema.Types.ObjectId, ref:'User'}]
  });
  return model('Game',schema);
})

/**
 * A function used to make sure we do not repeat declare models. Seems to be an issue with serverless offline.
 *
 * @param name name of the model to build.
 * @param build The function to build the model if the model has not already been built.
 */
function buildModel(name:string, build:() => Model<any>):Model<any>{
  if(connection.models[name]){
    console.warn(`Mongoose Model '${name}' already declared!`);
    return connection.models[name];
  }else{
    return build();
  }
}