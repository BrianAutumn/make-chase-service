import Serverless from 'serverless-http';
import App from './app';

module.exports.handler = Serverless(App);
