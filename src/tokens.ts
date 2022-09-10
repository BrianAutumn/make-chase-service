export const tokens = {
  buildNumber: '##BUILD_NUMBER##',
  buildDate: '##BUILD_DATE##',
  encryptionKey: '##ENCRYPTION_KEY##',
  isOffline: process.env.IS_OFFLINE,
  region: process.env.AWS_REGION,
  stage: process.env.AWS_STAGE,
  dbConn:'mongodb+srv://Applications:IrTDn29f9MbtN0Fd@cluster0.8mee5.mongodb.net/MakeChaseTest?retryWrites=true&w=majority'
}