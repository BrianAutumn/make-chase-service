const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: slsw.lib.webpack.isLocal ? [nodeExternals()] : ['aws-sdk'],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      }
    ],
  },
  resolve: {
    extensions: ['.mjs', '.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src",
          to: "src",
          globOptions: {
            ignore: ['**/*.js', '**/*.ts']
          }
        },
      ],
    }),
  ],
};
