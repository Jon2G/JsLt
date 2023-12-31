if [ ! -f "docdb-bastion.pem" ]; then
    echo "\033[0;31m❌ Debe agregar el archivo de certificado docdb-bastion.pem en la carpeta actual para poder conectarse a la base de datos"
    exit 1
fi

echo "Generando baseLayer"
ZIP_NAME="../baseLayer.zip"
VERSION_FILE_PATH="../baseLayer.version"
echo "Obteniendo SHA256 de todos los archivos"
SHA256_ALL_FILES=$(find . -type f -print0 | sort -z | xargs -r0 openssl dgst -sha256 | openssl dgst -sha256)
SHA256_SAVED=""
echo "Versión guardada: "$SHA256_ALL_FILES
if [ -f "$VERSION_FILE_PATH" ]; then
    echo "Versión actual  : "$SHA256_ALL_FILES
    SHA256_SAVED=$(cat $VERSION_FILE_PATH)
fi
if [ ! -e "$ZIP_NAME" ] || [ "$SHA256_ALL_FILES" != "$SHA256_SAVED" ]; then
    echo "$SHA256_ALL_FILES" >$VERSION_FILE_PATH
    if [ -f "$ZIP_NAME" ]; then
        rm -v $ZIP_NAME
    fi
    npm i --production --force
    mkdir -p nodejs
    mv node_modules nodejs/
    cp -v package.json nodejs/
    cp -v docdb-bastion.pem nodejs/
    zip -r -X $ZIP_NAME nodejs
    rm -Rf nodejs
else
    echo "Sin cambios"
fi
