import {validateJWT} from "../../utils/auth.util";
import {AuthenticationError} from "apollo-server-errors";
import {UserModel} from "../../data-models";
import {generateName} from "../../utils/username.util";

type LoginArgs = {
  jwt: string
};

type LoginResult = {
  success: Boolean;
};

export default {
  Mutation: {
    async login(rootValue: any, {jwt}: LoginArgs, context): Promise<LoginResult> {
      let validateJWTResult = await validateJWT(JSON.parse(jwt));
      if (!validateJWTResult.success) {
        return {
          success: false
        }
      }
      context.setCookies.push({
        name: 'session',
        value: validateJWTResult.sessionToken,
        options: {
          httpOnly: true
        }
      })
      if(!await UserModel.findOne({sub:validateJWTResult.payload.sub,iss:validateJWTResult.payload.iss})){
        console.log('user payload',validateJWTResult.payload);
        let user = new UserModel();
        user.sub = validateJWTResult.payload.sub;
        user.iss = validateJWTResult.payload.iss;
        user.displayName = generateName(validateJWTResult.payload.given_name, validateJWTResult.payload.family_name)
        user.email = validateJWTResult.payload.email;
        await user.save();
      }
      return {
        success: true
      };
    },
  },
  Query:{
    async me(rootValue: any, args, context): Promise<string> {
      let session;
      try{
        session = decodeURIComponent(context?.event?.headers?.cookie?.match(/(?<=session=).*?(?=$| |;)/g)[0])
      }finally {
      }
      if(!session){
        throw new AuthenticationError('No Session')
      }
      return session;
    }
  }
};
