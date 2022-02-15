import {OAuth2Client} from "google-auth-library";
import {appConf} from "../appConf";

const client = new OAuth2Client(appConf.google.clientId);

export async function validateJWT(jwt:string):Promise<boolean>{
  try{
    const ticket = await client.verifyIdToken({
      idToken: jwt,
      audience: appConf.google.clientId
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(userid);
    return true;
  }catch (e){
    console.error(e);
    return false;
  }

}