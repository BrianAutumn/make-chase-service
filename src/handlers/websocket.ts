import {APIGatewayEvent, Context} from "aws-lambda";
import {setupClient, createConnection, deleteConnection, subscribe} from "../services/connection.service";

/**
 *
 * @param {APIGatewayEvent} event
 * @param {Context} context
 * @returns {Promise<void>}
 */
export async function connect(event , context ) {
    setupClient(event.requestContext.apiId);
    await createConnection(event.requestContext.connectionId);
}

/**
 *
 * @param {APIGatewayEvent} event
 * @param {Context} context
 * @returns {Promise<void>}
 */
export async function disconnect(event, context) {
    setupClient(event.requestContext.apiId);
    await deleteConnection(event.requestContext.connectionId);
}

/**
 *
 * @param {APIGatewayEvent} event
 * @param {Context} context
 * @returns {Promise<void>}
 */
export async function defaulter(event, context) {
    setupClient(event.requestContext.apiId);
}

/**
 *
 * @param {APIGatewayEvent} event
 * @param {Context} context
 * @returns {Promise<void>}
 */
export async function subscribe(event, context) {
    setupClient(event.requestContext.apiId);
    const body = JSON.parse(event.body);
    let success = false;

    if (body.userId) {
        await subscribe(event.requestContext.connectionId, body.userId);
        success = true;
    }
}
