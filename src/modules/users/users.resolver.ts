import {validateJWT} from "../../utils/auth.util";

type LoginArgs = {
  jwt: string
};

type LoginResult = {
  success: Boolean;
};

export default {
  Mutation: {
    async login(rootValue: any, {jwt}: LoginArgs, context): Promise<any> {
      console.log('context', context)
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
          secure: true,
          httpOnly: true
        }
      })
      return {
        success: true
      };
    },
  },
};
