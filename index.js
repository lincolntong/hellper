const {magicText} = require('./magicText');
const {domCheck} = require('./domCheck');
const {HttpListen} = require('./httpListen');

// npm run check 执行
if (process.argv && process.argv.length) {
  if (isDev()) {
    const {CheckFolder} = require('./fileNameCheck');
    const check = new CheckFolder();
    check.show();
  }
}

function hellper(config = {}) {
  if (isDev()) {
    if (config.check) {
      domCheck();
    }
    if (config.magic) {
      magicText(true);
    }
  }
}

function isDev() {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'dev';
}


module.exports = {
  hellper,
  HttpListen
};
