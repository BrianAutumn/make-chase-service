import AWS from "aws-sdk";
import {MongoDao} from "../../../the-deep-web-service/src/daos/mango.dao";
import {Tokens} from "../../../the-deep-web-service/src/resources/tokens";
import {Connection} from "../dao/DBSchemas";

let client = undefined;

/**
 * @type {{event:string,details:any}} WSResponse
 * @type {{connectionId:string, [userId]:string, establishedTS:number}} Connection
 */

/**
 *
 * @param {string} apiId
 */
export function setupClient(apiId) {
  if (!client) {
    let endpoint = '';
    if (Tokens.isOffline) {
      endpoint = `http://localhost:3001`
    } else {
      endpoint = `https://${apiId}.execute-api.${Tokens.region}.amazonaws.com/${Tokens.stage}`;
    }
    console.log(`WS Endpoint: ${endpoint}`);
    client = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: endpoint
    })
  }
}

/**
 *
 * @param {string} connectionId
 * @returns {Promise<void>}
 */
export async function createConnection(connectionId) {
  new Connection({connectionId, establishedTS: Date.now()}).save()
}

/**
 *
 * @param {string} connectionId
 * @returns {Promise<void>}
 */
export async function deleteConnection(connectionId) {
  Connection.deleteOne({connectionId})
}

/**
 * Associates the given userId to the given connection
 *
 * @param {string} connectionId
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function subscribe(connectionId, userId) {
  let connection = await Connection.findOne({connectionId});
  connection.userId = userId;
  await connection.save();
}

/**
 * @returns {Promise<Array<Connection>>}
 */
export async function getConnections() {
  return Connection.find();
}

/**
 * Send data to a given connection or array of connections
 *
 * @param {Array<Connection> | Connection | string} connections
 * @param {WSResponse} response
 */
function postResponse(connections, response) {
  let conns = [];
  if (Array.isArray(connections)) {
    conns = connections;
  } else if (typeof connections === 'string') {
    conns.push({connectionId: connections});
  } else if (connections.connectionId) {
    conns.push(connections);
  } else {
    throw 'connections not valid!'
  }
  for (const con of conns) {
    getClient().postToConnection({
        Data: JSON.stringify(response),
        ConnectionId: con.connectionId
      },
      (err, data) => {
        if (err) console.log(`WS Post Error: ${err}`);
        else console.log(`WS Post Success: ${data}`);
      })
  }
}

function getClient() {
  if (!isClient()) {
    throw 'client not set up!'
  }
  return client;
}

function isClient() {
  return !!client;
}
