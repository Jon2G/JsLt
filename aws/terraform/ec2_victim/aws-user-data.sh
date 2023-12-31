#! /bin/bash
cd /tmp && \
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash && \
. ~/.nvm/nvm.sh && \
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install --lts
node -e "console.log('Running Node.js ' + process.version)"
cd && \
git clone "https://github.com/Jon2G/secure-and-scalable-authent-and-authoriz-System.git"  && \
cd secure-and-scalable-authent-and-authoriz-System/ && \
npm i #&& \
#npm run start && \
