
class HttpListen {
  constructor() {
    this.reqArr = [];
  }
  listen(req) {
    const now = new Date().getTime();
    this.reqArr.map(x => {
      if (x.url === req.url && x.method === req.method && (x.time - now) / 1000 < 500) {
        console.log(`%c${req.method}： ${req.url} 500ms被调用2次，检测是否重复执行。`,'color:#E14A9F');
      }
    })
    req.time = now;
    this.reqArr.push(req);
  }
}

module.exports = {
  HttpListen: HttpListen
};
