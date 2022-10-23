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
      if (board.victory) {
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
      resolve: (rootValue, other, context, third) => {
        console.log('other:', other)
        console.log('context:',context);
        console.log('third:',third)
        console.log('interesting:',JSON.stringify(context.$$internal.connection.data))
        let currentUser = context.currentUser;
        console.log('board update log:', currentUser)
        let userId = JSON.parse(currentUser).id
        console.log('user Id:',userId)
        let roles = rootValue.board.roles.filter(role => role.user._id.toString() === userId).map(role => role.role);
        console.log('roles:',JSON.stringify(roles));
        let result = viewFilter(rootValue.board, roles);
        console.log('result:',result);
        return result;
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
