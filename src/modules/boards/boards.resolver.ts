import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";
import {BoardModel} from "../../data-models";
import {makeActions} from "../../utils/gameEngine.util";

export default {
  Mutation: {
    async makeActions(rootValue, { gameId, actions }, {currentUser}) {
      let boardObject = await BoardModel.findOne({gameId});
      let board = boardObject.board;
      await board.populate('roles.user')
      await makeActions(board,actions,currentUser.id);
      boardObject.save();
      await pubSub.publish('BOARD_UPDATE',board);
      return 'SUCCESS';
    },
  },
  Query: {
    async board(rootValue, { gameId }, {}) {
      let board = (await BoardModel.findOne({gameId})).board;
      await board.populate('roles.user')
      return board;
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
