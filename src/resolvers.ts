import {pubSub} from "./graphqlResources";

export const Resolvers = {
  Mutation: {
    broadcastMessage: async (root, { message }) => {
      await pubSub.publish('NEW_MESSAGE', { message });

      return message;
    },
  },
  Query: {
    dummy: () => 'dummy',
  },
  Subscription: {
    messageBroadcast: {
      // rootValue is same as the event published above ({ message: string })
      // but our subscription should return just a string, so we're going to use resolve
      // to extract message from an event
      resolve: (rootValue) => rootValue.message,
      subscribe: pubSub.subscribe('NEW_MESSAGE'),
    },
  },
};