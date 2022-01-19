//We are manually listing all resolvers instead of using GraphQL tools due to Webpack bundling needing to trace imports

import example from './modules/example/example.resolver';

export default [
  example
];