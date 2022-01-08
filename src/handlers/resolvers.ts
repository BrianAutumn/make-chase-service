import {Dummy} from "../dao/DBSchemas";

export const Resolvers = {

  Query: {
    example: async (parent, {name, phrase}) => {
      await (new Dummy({name, phrase})).save();
      return {
        name,
        phrase,
        time: Date.now()
      }
    },
  },
};