import {validateJWT} from "../../utils/auth.util";
import {AuthenticationError} from "apollo-server-errors";
import {UserModel} from "../../data-models";

type LoginArgs = {
  jwt: string
};

type LoginResult = {
  success: Boolean
  authToken?: string
};

type User = {
  displayName: string
}


//TODO Need to figure out how to set the session as an http only cookie. Insecure right now.
export default {
  Mutation: {
    async login(rootValue: any, {jwt}: LoginArgs, context): Promise<LoginResult> {
      let validateJWTResult = await validateJWT(JSON.parse(jwt));
      if (!validateJWTResult.success) {
        return {
          success: false
        }
      }
      context.authToken = validateJWTResult.sessionToken;
      return {
        success: true
      };
    },
  },
  Query: {
    async session(rootValue: any, args, context): Promise<string> {
      let session;
      try {
        session = decodeURIComponent(context?.event?.headers?.cookie?.match(/(?<=session=).*?(?=$| |;)/g)[0])
      } finally {
      }
      if (!session) {
        throw new AuthenticationError('No Session')
      }
      return session;
    },
    async me(rootValue: any, args, {currentUser}): Promise<User> {
      return UserModel.findOne({_id: currentUser.id});
    }
  }
};
