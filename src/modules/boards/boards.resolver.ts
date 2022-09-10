import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";
import {BoardModel} from "../../data-models";
import {makeMove} from "../../utils/gameEngine.util";

export default {
  Mutation: {
    async makeMove(rootValue, { gameId, actions }, {currentUser}) {
      let board = (await BoardModel.findOne({gameId})).board;
      await makeMove(gameId,(await BoardModel.findOne({gameId})).board,actions,currentUser.id);
      return board;
    },
  },
  Query: {
    async board(rootValue, { gameId }, {currentUser}) {
      return JSON.stringify((await BoardModel.findOne({gameId})).board)
    }
  },
  Subscription: {
    boardUpdates: {
      resolve: (rootValue) => {
        return rootValue;
      },
      subscribe: withFilter(
        pubSub.subscribe('BOARD_UPDATE'),
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
