export const Tokens = {
  buildNumber: '##BUILD_NUMBER##',
  buildDate: '##BUILD_DATE##',
  isOffline: (process.env.IS_OFFLINE == "true"),
  region: process.env.AWS_REGION,
  stage: process.env.AWS_STAGE,
  testDBConnection: 'mongodb+srv://Applications:4oz6s8FCjAdCBJgI@cluster0.r1fpk.mongodb.net/MakeChaseTest?retryWrites=true&w=majority',
  liveDBConnection: '##PROD_DB_URL##',
  db: 'MakeChase'
};
