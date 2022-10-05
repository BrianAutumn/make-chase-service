import {join} from "path";
import {getToken} from "./token-manger";

export const appConf = {
  buildNumber: getToken('BUILD_NUMBER'),
  buildDate: getToken('BUILD_DATE'),
  encryptionKey: getToken('ENCRYPTION_KEY'),
  isOffline: process.env.IS_OFFLINE,
  region: process.env.AWS_REGION,
  stage: process.env.AWS_STAGE,
  dbConn: getToken('DB_CONN'),
  resources: join(__dirname, 'resources'),
  google: {
    clientId: "92116833711-06i78gunp707ht8vla0cdnsft3f1n5ks.apps.googleusercontent.com"
  }
}