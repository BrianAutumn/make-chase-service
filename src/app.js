'use strict';

import Express from 'express';
import BodyParser from 'body-parser';
import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import {Tokens} from "./resources/tokens";
import {GraphqlHandler} from "./handlers/graphql";

const app = Express();

AWS.config.logger = console;

app.use(BodyParser.json({strict: false}));

if (!Tokens.isOffline) {
    app.use(AWSXRay.express.openSegment('app'));
}

app.use('/api', GraphqlHandler);

app.all('*', (req, res) => {
    res.status(404).send(`NOT FOUND - ${req.method} ${req.url}`);
});

if (!Tokens.isOffline) {
    app.use(AWSXRay.express.closeSegment());
}

export default app;
