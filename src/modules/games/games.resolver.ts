import {pubSub} from "../../graphqlResources";
import {GameModel} from "../../data-models";
import {withFilter} from "aws-lambda-graphql";
import {startGame} from "../../utils/gameEngine.util";

export default {
  Mutation: {
    async createGame(rootValue, {name}, {currentUser}): Promise<any> {
      let game = new GameModel();
      console.log('currentUser log',currentUser)
      game.created = Date.now();
      game.name = name;
      game.users = [currentUser.id]
      game.state = 'LOBBY'
      await game.save();
      await game.populate('users')
      await pubSub.publish('UPDATE_GAMES', game);
      return game;
    },
    async joinGame(rootValue, {gameId}, {currentUser}): Promise<any> {
      let game = await GameModel.findOne({_id:gameId})
      if(!game.users.includes(currentUser.id) && game.users.length === 1){
        game.users.push(currentUser.id)
        await game.populate('users')
        if(game.users.length === 2){
          await startGame(gameId, game.users.map(user => user._id));
          game.state = 'ACTIVE';
        }
        await game.save();
        await game.populate('users')
        await pubSub.publish('UPDATE_GAMES', game);
      }else{
        await game.populate('users')
      }
      return game;
    },
    async closeGame(rootValue, {gameId}, {currentUser}): Promise<any> {
      let game = await GameModel.findOne({_id:gameId});
      await game.populate('users')
      if(game.users.find(user => user._id.toString() === currentUser.id)){
        game.state = 'CLOSED';
        await game.save();
      }
      await pubSub.publish('UPDATE_GAMES', game);
      return game;
    },
  },
  Query:{
    async games(): Promise<any> {
      return await GameModel.find().populate('users').exec();
    }
  },
  Subscription: {
    gameFeed: {
      resolve: (rootValue) => {
        console.log('resolve games log')
        return rootValue;
      },
      subscribe: withFilter(
        pubSub.subscribe('UPDATE_GAMES'),
        (rootValue, args, context) => {
          console.log('with filter log')
          return true;
        },
      ),
    },
  },
};
