const config = require('../../hellper.config.js');

class HttpListen {
  constructor() {
    this.reqArr = [];
    this.consoleArr = []; // 打印过的url
  }

  listen(req) {
    if (!isDev()) {
      return;
    }
    if (config && ! config.check) {
      return;
    }
    const now = new Date().getTime();
    let repeat = false;
    let item = this.reqArr.find(x => x.url === req.url && x.method === req.method && (now - x.time) < 500);
    req.time = now;

    if (item && !(this.consoleArr.find(x => x.url === item.url && x.method === item.method))) {
      console.log(`%c请求：`, 'color:#E14A9F', window.location.pathname);
      console.log(`%c路由：`, 'color:#E14A9F', `${req.url}(${req.method})`);
      console.log(`500ms被调用2次，检测是否重复执行`);
      this.consoleArr.push(req)
    }
    this.reqArr.push(req);
  }
}

function isDev() {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'dev';
}

module.exports = {
  HttpListen: HttpListen
};
