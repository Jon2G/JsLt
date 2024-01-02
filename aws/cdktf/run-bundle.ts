import path = require('path');
import { bundleLambdaFunction, getLambdaFunctionsFromFolders, LambdaFuntionInfo } from './bundle';

const currentDir = path.resolve("./");
const  awsFolder:string =path.resolve("./aws/")+"/";
const lambdaFunctionsFolder:string =path.join( awsFolder , "lambda/functions");
const terraformFolder:string =path.join( awsFolder , "terraform/");
const packagesFolder:string =path.join( awsFolder , "packages/");
console.log({
    currentDir,
    awsFolder,
    lambdaFunctionsFolder,
    terraformFolder,
    packagesFolder
})

const functions:LambdaFuntionInfo[] = getLambdaFunctionsFromFolders(lambdaFunctionsFolder,terraformFolder,packagesFolder)
for(const lambdaInfo of functions){
    bundleLambdaFunction(lambdaInfo)
    .then(()=>{{console.log(`bundled ${lambdaInfo.name}`)}})    
}