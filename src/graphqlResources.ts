import {Tokens} from "./resources/tokens";
import {ApiGatewayManagementApi, DynamoDB} from "aws-sdk";
import {
  DynamoDBConnectionManager,
  DynamoDBEventProcessor,
  DynamoDBEventStore,
  DynamoDBSubscriptionManager,
  PubSub
} from "aws-lambda-graphql";

let dynamoDb;
if (Tokens.isOffline === 'true') {
  dynamoDb = new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
  console.log(dynamoDb);
} else {
  dynamoDb = new DynamoDB.DocumentClient();
}

const eventStore = new DynamoDBEventStore({dynamoDbClient:dynamoDb});
export const pubSub = new PubSub({ eventStore });

export const eventProcessor = new DynamoDBEventProcessor();
export const subscriptionManager = new DynamoDBSubscriptionManager({dynamoDbClient:dynamoDb});
export const connectionManager = new DynamoDBConnectionManager({
  subscriptions: subscriptionManager,
  apiGatewayManager: process.env.IS_OFFLINE
    ? new ApiGatewayManagementApi({
      endpoint: 'http://localhost:3001',
    })
    : undefined,
  dynamoDbClient:dynamoDb
});