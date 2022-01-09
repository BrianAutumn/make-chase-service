import {Dummy} from "../dao/DBSchemas";
import { subscribe } from 'graphql-lambda-subscriptions'
import {subscriptionServer} from "./websocket";

// setInterval(() => {
//   subscriptionServer.publish({
//     topic: 'ALARM',
//     payload: {
//       time: Date.now(),
//     },
//   })
// },60000)

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
      subscribe: subscribe('ALARM'),
      resolve: (event, args, context) => {
        console.log('RESOLVING SUBSCRIPTION');
        return {time:Date.now()};
      }
    }
  }
};