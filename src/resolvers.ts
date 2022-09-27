//We are manually listing all resolvers instead of using GraphQL tools due to Webpack bundling needing to trace imports

import example from './modules/example/example.resolver';
import users from './modules/users/users.resolver';
import games from "./modules/games/games.resolver";
import boards from "./modules/boards/boards.resolver";

export default [
  example,
  users,
  games,
  boards
];