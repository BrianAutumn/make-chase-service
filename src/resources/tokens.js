export const Tokens = {
    buildNumber: '##BUILD_NUMBER##',
    buildDate: '##BUILD_DATE##',
    isOffline: process.env.IS_OFFLINE,
    region: process.env.AWS_REGION,
    stage: process.env.AWS_STAGE,
    testDBConnection: '##PROD_DB_URL##',
    liveDBConnection: '',
    db: 'TheDeepDarkWeb'
};
