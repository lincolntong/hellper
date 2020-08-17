class HttpListen {
  constructor() {
    this.reqArr = [];
  }

  listen(req) {
    const now = new Date().getTime();
    this.reqArr.map(x => {
      if (x.url === req.url && x.method === req.method && (now - x.time) < 500) {
        console.log(`%c请求：`, 'color:#E14A9F', window.location.pathname);
        console.log(`%c路由：`, 'color:#E14A9F', `${req.url}(${req.method})`);
        console.log(`500ms被调用2次，检测是否重复执行`);
      }
    });
    req.time = now;
    this.reqArr.push(req);
  }
}

module.exports = {
  HttpListen: HttpListen
};
