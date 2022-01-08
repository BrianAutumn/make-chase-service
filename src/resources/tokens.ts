export const Tokens = {
  buildNumber: '##BUILD_NUMBER##',
  buildDate: '##BUILD_DATE##',
  isOffline: process.env.IS_OFFLINE,
  region: process.env.AWS_REGION,
  stage: process.env.AWS_STAGE,
  testDBConnection: 'mongodb+srv://Applications:XAstPTpMHcCSdlYx@cluster0.8mee5.mongodb.net/MakeChase?retryWrites=true&w=majority',
  liveDBConnection: '##PROD_DB_URL##',
  db: 'MakeChase'
};