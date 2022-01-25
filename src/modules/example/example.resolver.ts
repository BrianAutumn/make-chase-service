import {ulid} from "ulid";
import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";
import {MessageModel} from "../../data-models";

type MessageType = 'greeting' | 'test';

type Message = {
  messageId: string;
  text: string;
  type: MessageType;
  timestamp: string;
};

type SendMessageArgs = {
  text: string;
  type: MessageType;
};

export default {
  Mutation: {
    async sendMessage(rootValue: any, { text, type }: SendMessageArgs) {
      const payload: Message = { messageId: ulid(), text, type, timestamp:Date.now().toString() };

      await new MessageModel(payload).save()
      await pubSub.publish('NEW_MESSAGE', payload);

      return payload;
    },
  },
  Query: {
    serverTime: () => Date.now(),
    messages: async() => {
      return await MessageModel.find().exec();
    }
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
