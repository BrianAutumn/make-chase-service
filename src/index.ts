import Serverless from 'serverless-http';
import App from './app';

export const handler = Serverless(App);
