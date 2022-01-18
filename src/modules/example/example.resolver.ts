import {ulid} from "ulid";
import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";

type MessageType = 'greeting' | 'test';

type Message = {
  id: string;
  text: string;
  type: MessageType;
};

type SendMessageArgs = {
  text: string;
  type: MessageType;
};

export default {
  Mutation: {
    async sendMessage(rootValue: any, { text, type }: SendMessageArgs) {
      const payload: Message = { id: ulid(), text, type };

      await pubSub.publish('NEW_MESSAGE', payload);

      return payload;
    },
  },
  Query: {
    serverTime: () => Date.now(),
  },
  Subscription: {
    messageFeed: {
      resolve: (rootValue: Message) => {
        // root value is the payload from sendMessage mutation
        return rootValue;
      },
      subscribe: withFilter(
        pubSub.subscribe('NEW_MESSAGE'),
        (rootValue: Message, args: { type: null | MessageType }) => {
          // this can be async too :)
          if (args.type == null) {
            return true;
          }

          return args.type === rootValue.type;
        },
      ),
    },
  },
};
