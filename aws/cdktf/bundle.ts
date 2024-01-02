import * as fs from 'fs';
import * as path from "path";
const esbuild = require('esbuild')

export interface LambdaFuntionInfo{
    srcDir:string,
    name:string,
    zipPath:string,
    compilePath:string,
  }


export function getLambdaFunctionsFromFolders(lambdaFunctionsFolder:string,terraformFolder:string,packagesFolder:string){
    const functions = fs.readdirSync(lambdaFunctionsFolder)
    .map(file=>{
      const lambdaInfo:LambdaFuntionInfo={
        srcDir:path.join(lambdaFunctionsFolder,file),
        name:file,
        zipPath: terraformFolder +`/zips/lambda_function_${file}.zip`,
        compilePath: packagesFolder+'/'+file
      }
      return lambdaInfo
    })
    .filter((x) => fs.lstatSync(x.srcDir).isDirectory() && fs.existsSync(path.join(x.srcDir,'index.ts')))
    return functions
  }

export async function bundleLambdaFunction(lambdaInfo:LambdaFuntionInfo){
    //const outDirPath = path.join('./../packages')
await esbuild.build({
	entryPoints: [path.join(lambdaInfo.srcDir,'index.ts')],
	bundle: true,
	sourcemap: true,
	outdir: lambdaInfo.compilePath,
	outbase: lambdaInfo.srcDir,
	platform: 'node',
	target: 'node18',
	external: [
		'@aws-sdk/client-ssm',
		'mongodb'
	],
	plugins: []
})

  }