import {withFilter} from "aws-lambda-graphql";
import {pubSub} from "../../graphqlResources";
import {BoardModel} from "../../data-models";
import {makeActions} from "../../utils/gameEngine.util";
import {removeMetadata, viewFilter} from "../../utils/metadata.util";
import {completeGame} from "../games/games.resolver";

export default {
  Mutation: {
    async makeActions(rootValue, {gameId, actions}, {currentUser}) {
      let boardObject = await BoardModel.findOne({gameId});
      let board = boardObject.board;
      await board.populate('roles.user')
      await makeActions(board, actions, currentUser.id);
      boardObject.save();
      if(board.victory){
        await completeGame(gameId)
      }
      console.log('push board update log:', JSON.stringify(boardObject));
      await pubSub.publish('BOARD_UPDATE', boardObject);
      return 'SUCCESS';
    },
  },
  Query: {
    async board(rootValue, {gameId}, {currentUser}) {
      let board = (await BoardModel.findOne({gameId})).board;
      await board.populate('roles.user')
      board = JSON.parse(JSON.stringify(board))
      let roles = board.roles.filter(role => role.user._id.toString() === currentUser.id).map(role => role.role);
      return removeMetadata(viewFilter(board, roles));
    }
  },
  Subscription: {
    boardUpdates: {
      // resolve: (rootValue, {}, {currentUser}) => {
      //   console.log('board update log')
      //   let userId = JSON.parse(currentUser).id
      //   let roles = rootValue.board.roles.filter(role => role.user._id.toString() === userId).map(role => role.role);
      //   return removeMetadata(viewFilter(rootValue.board, roles));
      // },
      resolve: (rootValue, {}, {}) => {
        return rootValue.board
      },
      subscribe: withFilter(
        pubSub.subscribe('BOARD_UPDATE'),
        (rootValue, {gameId}, context) => {
          if (gameId === null) {
            return false;
          }

          return gameId === rootValue.gameId;
        },
      ),
    },
  },
};
