import {OAuth2Client} from "google-auth-library";
import {appConf} from "../app-conf";
import {encrypt} from "./crypto.util";
import {UserModel} from "../data-models";
import {generateName} from "./username.util";

const client = new OAuth2Client(appConf.google.clientId);

type ValidateJWTResult = {
  success: boolean,
  sessionToken?: string,
  payload?: any
}

export async function validateJWT(jwt: any): Promise<ValidateJWTResult> {
  try {
    console.log('JWT',jwt)
    if (jwt.clientId !== appConf.google.clientId) {
      console.error(`Invalid ClientID! '${jwt.clientId}' '${appConf.google.clientId}'`)
      return {success: false};
    }
    const ticket = await client.verifyIdToken({
      idToken: jwt.credential,
      audience: jwt.clientId
    });
    const payload = ticket.getPayload();
    console.log('payload',payload)
    let user = await UserModel.findOne({sub: payload.sub, iss: payload.iss});
    if (!user) {
      console.log('Flag A')
      user = new UserModel();
      user.sub = payload.sub;
      user.iss = payload.iss;
      user.displayName = generateName(payload.given_name, payload.family_name)
      console.log('Flag B')
      user.email = payload.email;
      user.created = Date.now();
      console.log('Flag C')
      await user.save();
      console.log('Flag D')
    }
    console.log('Flag E')
    let sessionDetails = {
      created: Date.now(),
      id: user._id
    }
    console.log('Flag F')
    let sessionToken = encrypt(JSON.stringify(sessionDetails));
    console.log('Flag G')
    return {
      success: true,
      sessionToken,
      payload
    };
  } catch (e) {
    console.error(e);
    return {success: false};
  }

}