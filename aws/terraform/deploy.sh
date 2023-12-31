#!/bin/bash
md5="./../packages/index.js"
hash="$(echo -n "$md5" | md5sum )"
echo "Hashing version $hash"
echo ${hash//\-/}
hash=${hash//[-]/}

hash="$( echo $hash | xargs echo )"
echo "Deploying version ~$hash~"
  #cd .. && rm -rf ./dist &&\
  #cd ../terraform && \
  terraform plan -input=false -var lambdasVersion="$hash" -out=./tfplan  &&
  terraform apply "./tfplan" &&
  terraform output
  #&& \
  #terraform apply -input=false ./tfplan
