'use strict';

import {tokens} from "./tokens";

import * as mongoose from "mongoose";

let conn = null;

const uri = tokens.dbConn;

export async function connect() {
  if (conn == null) {
    conn = mongoose.connect(uri,{maxIdleTimeMS : 270000, minPoolSize : 2, maxPoolSize : 4}).then(() => mongoose);

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return conn;
}