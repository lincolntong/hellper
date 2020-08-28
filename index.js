const {HttpListen} = require('./httpListen');

// npm run check 执行
if (process.argv && process.argv.length) {
  const { check }=require('./fileNameCheck');
  check();

} else { // 项目运行
  const {magicText} = require('./magicText');
  const {domCheck} = require('./domCheck');
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
}

function isDev() {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'dev';
}

module.exports = {
  hellper,
  HttpListen
};
