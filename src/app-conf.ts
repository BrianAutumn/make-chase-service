import {join} from "path";
import {getToken} from "./token-manger";

console.log('dirname',__dirname)

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
    clientId: getToken('GOOGLE_CLIENT_ID')
  }
}