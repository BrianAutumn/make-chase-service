import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";
import {BoardModel} from "../../data-models";

export default {
  Mutation: {
    async makeMove(rootValue, { gameId, actions }, {currentUser}) {
    },
  },
  Query: {
    async board(rootValue, { gameId }, {currentUser}) {
      return JSON.stringify(await BoardModel.findOne({gameId}))
    }
  },
  Subscription: {
    boardUpdates: {
      resolve: (rootValue) => {
        return rootValue;
      },
      subscribe: withFilter(
        pubSub.subscribe('GAME_UPDATE'),
        (rootValue, { gameId }, context) => {
          if (gameId === null) {
            return false;
          }

          return gameId === rootValue.gameId;
        },
      ),
    },
  },
};
