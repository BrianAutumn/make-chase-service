export const tokens = {
  buildNumber: '##BUILD_NUMBER##',
  buildDate: '##BUILD_DATE##',
  isOffline: process.env.IS_OFFLINE,
  region: process.env.AWS_REGION,
  stage: process.env.AWS_STAGE,
  dbConn:'##PROD_DB_URL##',
}