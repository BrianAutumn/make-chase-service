import {OAuth2Client} from "google-auth-library";
import {appConf} from "../appConf";
import {encrypt} from "./crypto.util";

const client = new OAuth2Client(appConf.google.clientId);

type ValidateJWTResult = {
  success:boolean,
  sessionToken?:string
}

export async function validateJWT(jwt:any):Promise<ValidateJWTResult>{
  try{
    console.log(jwt);
    if(jwt.clientId !== appConf.google.clientId){
      console.error(`Invalid ClientID! ${jwt.clientId}`)
      return {success:false};
    }
    const ticket = await client.verifyIdToken({
      idToken: jwt.credential,
      audience: jwt.clientId
    });
    const payload = ticket.getPayload();
    console.log('payload',payload);
    const userid = payload['sub'];
    console.log(userid);
    let sessionDetails = {
      sub:payload.sub,
      iss:payload.iss,
      created:Date.now()
    }
    let sessionToken = encrypt(JSON.stringify(sessionDetails));
    return {
      success:true,
      sessionToken
    };
  }catch (e){
    console.error(e);
    return {success:false};
  }

}