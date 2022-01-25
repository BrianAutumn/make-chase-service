import {Schema, model, connection, Model} from 'mongoose';

export const MessageModel = buildModel('Message', () => {
  const messageSchema = new Schema({
    timestamp: {type:String, required:true},
    text: {type:String, required:true},
    type: {type:String, required:true},
    messageId: {type:String, required:true}
  });
  return model('Message',messageSchema);
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