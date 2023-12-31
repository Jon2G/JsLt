const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

const outDirPath = path.join('./../packages')
const srcDir = path.join('./../lambda/src')
console.log(`outDirPath: ${outDirPath}`)
esbuild.build({
	entryPoints: ['./../lambda/src/index.ts'],
	bundle: true,
	sourcemap: true,
	outdir: outDirPath,
	outbase: srcDir,
	platform: 'node',
	target: 'node18',
	external: [
		'@aws-sdk/client-ssm',
		'mongodb'
	],
	plugins: []
})