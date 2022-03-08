import {OAuth2Client} from "google-auth-library";
import {appConf} from "../appConf";
import {encrypt} from "./crypto.util";
import {UserModel} from "../data-models";
import {generateName} from "./username.util";

const client = new OAuth2Client(appConf.google.clientId);

type ValidateJWTResult = {
  success:boolean,
  sessionToken?:string,
  payload?:any
}

export async function validateJWT(jwt:any):Promise<ValidateJWTResult>{
  try{
    if(jwt.clientId !== appConf.google.clientId){
      console.error(`Invalid ClientID! ${jwt.clientId}`)
      return {success:false};
    }
    const ticket = await client.verifyIdToken({
      idToken: jwt.credential,
      audience: jwt.clientId
    });
    const payload = ticket.getPayload();
    let user = await UserModel.findOne({sub:payload.sub,iss:payload.iss});
    if(!user){
      user = new UserModel();
      user.sub = payload.sub;
      user.iss = payload.iss;
      user.displayName = generateName(payload.given_name, payload.family_name)
      user.email = payload.email;
      user.created = Date.now();
      await user.save();
    }
    let sessionDetails = {
      created:Date.now(),
      id:user._id
    }
    let sessionToken = encrypt(JSON.stringify(sessionDetails));
    return {
      success:true,
      sessionToken,
      payload
    };
  }catch (e){
    console.error(e);
    return {success:false};
  }

}