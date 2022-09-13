import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";
import {BoardModel} from "../../data-models";
import {makeActions} from "../../utils/gameEngine.util";
import {removeMetadata, viewFilter} from "../../utils/metadata.util";

export default {
  Mutation: {
    async makeActions(rootValue, { gameId, actions }, {currentUser}) {
      let boardObject = await BoardModel.findOne({gameId});
      let board = boardObject.board;
      await board.populate('roles.user')
      await makeActions(board,actions,currentUser.id);
      boardObject.save();
      await pubSub.publish('BOARD_UPDATE',boardObject);
      return 'SUCCESS';
    },
  },
  Query: {
    async board(rootValue, { gameId }, {currentUser}) {
      let board = (await BoardModel.findOne({gameId})).board;
      await board.populate('roles.user')
      board = JSON.parse(JSON.stringify(board))
      console.log('board_log', board);
      let roles = board.roles.filter(role => role.user._id.toString() === currentUser.id).map(role => role.role);
      return removeMetadata(viewFilter(board,roles));
    }
  },
  Subscription: {
    boardUpdates: {
      resolve: (rootValue, {}, {currentUser}) => {
        let userId = JSON.parse(currentUser).id
        let roles = rootValue.board.roles.filter(role => role.user._id.toString() === userId).map(role => role.role);
        console.log('board_log',rootValue.board);
        return removeMetadata(viewFilter(rootValue.board,roles));
      },
      subscribe: withFilter(
        pubSub.subscribe('BOARD_UPDATE'),
        (rootValue, { gameId }, context) => {
          console.log('rootvalue log', rootValue, gameId);
          if (gameId === null) {
            return false;
          }

          return gameId === rootValue.gameId;
        },
      ),
    },
  },
};
