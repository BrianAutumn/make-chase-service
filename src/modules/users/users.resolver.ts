import {validateJWT} from "../../utils/auth.util";

type LoginArgs = {
  jwt:string
};

type LoginResult = {
  success: Boolean;
};

export default {
  Mutation: {
    async login(rootValue: any, { jwt }: LoginArgs): Promise<LoginResult> {
      return {
        success:await validateJWT(jwt)
      };
    },
  },
};
