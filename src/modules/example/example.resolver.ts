import {ulid} from "ulid";
import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";
import {MessageModel, UserModel} from "../../data-models";

type MessageType = 'greeting' | 'test';

type Message = {
  messageId: string;
  text: string;
  type: MessageType;
  timestamp: number;
};

type SendMessageArgs = {
  text: string;
  type: MessageType;
};

export default {
  Mutation: {
    async sendMessage(rootValue: any, { text, type }: SendMessageArgs, {currentUser}) {
      let message = new MessageModel();
      message.text = text;
      message.type = type;
      message.timestamp = Date.now();
      message.user = currentUser.id;
      await message.save();
      message.user = await UserModel.findOne({_id:currentUser.id})
      await pubSub.publish('NEW_MESSAGE', message);
      return message;
    },
  },
  Query: {
    serverTime: () => Date.now(),
    messages: async() => {
      return await MessageModel.find().populate('user').exec();
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
        (rootValue: Message, args: { type: null | MessageType }, context) => {
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
