const {CheckFolder} = require('./fileNameCheck');
const {magicText} = require('./magicText');
const {domCheck} = require('./domCheck');

// npm run check 执行
if (process.argv && process.argv.length) {
  const check = new CheckFolder();
  check.show();
}

function hellper(config = {}) {
  if ( process.env.NODE_ENV === 'development') {
    if (config.check) {
      domCheck();
    }
    if (config.magic) {
      magicText(true);
    }
  }
}

module.exports = {
  hellper
};
