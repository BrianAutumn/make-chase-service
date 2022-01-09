# make-chase-service

First install all the npm packages for the project

```
npm install
```

The service uses the "serverless" framework to manage the serverless resources. To setup the repo you need to install serverless globally to your system.

To do this run the command:

```
npm install -g serverless
```

If you are running on windows you also need to run

```
Remove-Item alias:sls
```

if you are using powershell to get access to the serverless commands.

You then need to install local dynamodb service. Do so by running the command:

```
sls dynamo db install
```

You then need to run the "run-local-DB" script followed  by the "run-offline" script.