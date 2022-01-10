import {Dummy} from "../dao/DBSchemas";
import {DynamoDBEventStore, PubSub} from "aws-lambda-graphql";
const eventStore = new DynamoDBEventStore();
export const pubSub = new PubSub({ eventStore });

setInterval(() => {
  pubSub.publish(
    'ALARM',
    {
      time: Date.now(),
    })
},60000)

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
  Subscription: {
    alarm: {
      subscribe: pubSub.subscribe('ALARM'),
      resolve: (event) => event.time
    }
  }
};